// src/routes/dashboard_user/categories.tsx
import React, { useMemo, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries, // Keep useQueries
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Category,
  CategoryRequirement,
  checkUserEligibility,
  getRequirements,
  getUserCategories,
  listCategories,
  registerUserInCategory,
  UserCategory,
} from '@/backend/category_backend';
import {
  Users,
  ListChecks,
  Award,
  AlertTriangle,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { LevelName, Uuid } from '@/backend/common';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AuthManager } from '@/backend/auth';

export const Route = createFileRoute('/dashboard_user/categories')({
  component: UserCategoryPageComponent,
  loader: async () => {
    const userId = AuthManager.getUserId();
    if (!userId) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: Route.fullPath },
      });
    }
    return { userId };
  },
});

// --- Interfaces ---
export interface EnrichedCategoryData {
  category: Category;
  requirements: CategoryRequirement[];
  userLevel: LevelName | null;
}

export interface EligibilityStatus {
  isLoading: boolean;
  isEligible: boolean; // Changed: Backend error now means not eligible
  errorReason: string | null; // To store the specific reason for ineligibility
}

// --- Page Component ---
function UserCategoryPageComponent() {
  const { userId } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [registeringCategoryId, setRegisteringCategoryId] = useState<Uuid | null>(null);

  const {
    data: allCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['allCategories'],
    queryFn: listCategories,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: userCategoryAssignmentsData,
    isLoading: isLoadingUserCats,
    isError: isErrorUserCats,
    error: errorUserCats,
  } = useQuery({
    queryKey: ['userCategories', userId],
    queryFn: () => getUserCategories(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
  const userCategoryAssignments = Array.isArray(userCategoryAssignmentsData) ? userCategoryAssignmentsData : [];


  const categoryIds = useMemo(() => allCategories?.map(c => c.id_category) ?? [], [allCategories]);

  const requirementsQueries = useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ['categoryRequirements', id],
      queryFn: () => getRequirements(id),
      staleTime: 10 * 60 * 1000,
      enabled: !!allCategories && categoryIds.length > 0,
    })),
  });
  const isLoadingRequirements = requirementsQueries.some(q => q.isLoading);
  const isErrorRequirements = requirementsQueries.some(q => q.isError);
  const errorRequirements = requirementsQueries.find(q => q.isError)?.error as Error | undefined;


  const enrichedCategories = useMemo<EnrichedCategoryData[]>(() => {
    if (isLoadingCategories || (!!userId && isLoadingUserCats) || isLoadingRequirements || !allCategories) {
      return [];
    }
    const userLevelMap = new Map<Uuid, UserCategory>();
    userCategoryAssignments.forEach(uc => userLevelMap.set(uc.id_category, uc));

    const requirementsMap = new Map<Uuid, CategoryRequirement[]>();
    requirementsQueries.forEach((queryResult, index) => {
      if (queryResult.isSuccess && queryResult.data && categoryIds[index]) {
        requirementsMap.set(categoryIds[index], queryResult.data);
      }
    });

    return allCategories.map(category => {
      const userAssignment = userLevelMap.get(category.id_category);
      const requirements = requirementsMap.get(category.id_category) ?? [];
      return {
        category,
        requirements,
        userLevel: userAssignment?.user_level ?? null,
      };
    });
  }, [allCategories, userCategoryAssignments, requirementsQueries, categoryIds, isLoadingCategories, isLoadingUserCats, isLoadingRequirements, userId]);


  const registeredCategoryList = enrichedCategories.filter(ec => ec.userLevel !== null);
  const potentiallyAvailableList = enrichedCategories.filter(ec => ec.userLevel === null);
  const potentiallyAvailableIds = useMemo(() => potentiallyAvailableList.map(ec => ec.category.id_category), [potentiallyAvailableList]);

  const eligibilityQueries = useQueries({
    queries: potentiallyAvailableIds.map((catId) => ({
      queryKey: ['categoryEligibility', catId, userId],
      queryFn: async () => {
        try {
          return await checkUserEligibility(catId, userId!);
        } catch (error) {
          // Throw the error so React Query marks it as an error and captures the message
          throw error;
        }
      },
      enabled: !!userId && potentiallyAvailableIds.length > 0,
      staleTime: 1 * 60 * 1000,
      retry: false, // Important: Do not retry on eligibility check errors
    })),
  });
  const isLoadingEligibility = eligibilityQueries.some(q => q.isLoading);


  const eligibilityStatusMap = useMemo(() => {
    const map = new Map<Uuid, EligibilityStatus>();
    eligibilityQueries.forEach((queryResult, index) => {
      const categoryId = potentiallyAvailableIds[index];
      if (categoryId) {
        map.set(categoryId, {
          isLoading: queryResult.isLoading,
          isEligible: queryResult.isSuccess, // If query isSuccess, backend returned true
          errorReason: queryResult.isError && queryResult.error instanceof Error ? queryResult.error.message : null,
        });
      }
    });
    return map;
  }, [eligibilityQueries, potentiallyAvailableIds]);


  const registerMutation = useMutation({
    mutationFn: (categoryId: Uuid) => registerUserInCategory(categoryId, userId!),
    onMutate: (categoryId) => {
      setRegisteringCategoryId(categoryId);
    },
    onSuccess: (_, categoryId) => {
      toast.success("Successfully registered for category!");
      queryClient.invalidateQueries({ queryKey: ['userCategories', userId] });
      queryClient.invalidateQueries({ queryKey: ['categoryEligibility', categoryId, userId] });
    },
    onError: (error: Error) => {
      console.error("Registration Error:", error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setRegisteringCategoryId(null);
    }
  });

  const isLoadingOverall = isLoadingCategories || (!!userId && isLoadingUserCats) || isLoadingRequirements || (potentiallyAvailableIds.length > 0 && isLoadingEligibility);
  const isCriticalError = isErrorCategories || (!!userId && isErrorUserCats) || isErrorRequirements;
  const criticalError = errorCategories || errorUserCats || errorRequirements;


  if (isLoadingOverall) {
    return <LoadingSkeletons />;
  }

  if (isCriticalError) {
    return <ErrorDisplay error={criticalError instanceof Error ? criticalError : new Error("An unknown critical error occurred")} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Available Categories</h1>
        {potentiallyAvailableList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {potentiallyAvailableList.map(({ category, requirements }) => {
              const eligibilityStatus = eligibilityStatusMap.get(category.id_category) ?? {
                isLoading: false, isEligible: false, errorReason: "Eligibility status not found."
              };
              return (
                <AvailableCategoryCard
                  key={category.id_category}
                  category={category}
                  requirements={requirements}
                  userId={userId}
                  eligibilityStatus={eligibilityStatus}
                  onRegister={registerMutation.mutate}
                  isRegistering={registeringCategoryId === category.id_category}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No other categories currently available or all categories assigned.
          </p>
        )}
      </div>
      <Separator />
      <div>
        <h1 className="text-2xl font-bold mb-4">My Assigned Categories</h1>
        {registeredCategoryList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredCategoryList.map(({ category, requirements, userLevel }) => (
              <RegisteredCategoryCard
                key={category.id_category}
                category={category}
                requirements={requirements}
                userLevel={userLevel!}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            You are not currently assigned to any categories.
          </p>
        )}
      </div>
    </div>
  );
}

// --- Card Components ---
interface AvailableCategoryCardProps {
  category: Category;
  requirements: CategoryRequirement[];
  userId: Uuid;
  eligibilityStatus: EligibilityStatus;
  onRegister: (categoryId: Uuid) => void;
  isRegistering: boolean;
}

const AvailableCategoryCard: React.FC<AvailableCategoryCardProps> = ({
  category,
  requirements,
  userId,
  eligibilityStatus,
  onRegister,
  isRegistering,
}) => {
  const handleRegisterClick = () => {
    onRegister(category.id_category);
  };

  const renderFooterContent = () => {
    if (eligibilityStatus.isLoading) {
      return (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking eligibility...
        </div>
      );
    }

    // If not eligible (isEligible is false due to error or explicit false from backend)
    if (!eligibilityStatus.isEligible) {
      return (
        <Alert variant="destructive" className="p-3 text-xs w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-semibold">Not Eligible</AlertTitle>
          <AlertDescription>
            {eligibilityStatus.errorReason || "User does not meet category requirements."}
          </AlertDescription>
        </Alert>
      );
    }

    // If eligible
    return (
      <Button
        size="sm"
        onClick={handleRegisterClick}
        disabled={isRegistering}
        className="w-full sm:w-auto"
      >
        {isRegistering ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {isRegistering ? 'Registering...' : 'Register'}
      </Button>
    );
  };

  return (
    <Card className="w-full max-w-md mb-4 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" /> {category.name}
          </CardTitle>
          <CardDescription>
            Age Range: {category.min_age} - {category.max_age} years
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-3">
          {requirements.length > 0 ? (
            <div>
              <h4 className="font-semibold mb-1 flex items-center">
                <ListChecks className="mr-2 h-4 w-4 text-gray-500" /> Requirements:
              </h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {requirements.map((req) => (
                  <li key={req.id_category_requirement}>
                    {req.requirement_description}
                    <Badge variant="secondary" className="ml-2">
                      Level: {req.required_level}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="italic text-gray-500">No specific requirements listed.</p>
          )}
        </CardContent>
      </div>
      <CardFooter className="pt-4 border-t dark:border-gray-600 mt-auto flex justify-end">
        {renderFooterContent()}
      </CardFooter>
    </Card>
  );
};

interface RegisteredCategoryCardProps {
  category: Category;
  requirements: CategoryRequirement[];
  userLevel: LevelName;
}

const RegisteredCategoryCard: React.FC<RegisteredCategoryCardProps> = ({
  category,
  requirements,
  userLevel,
}) => {
  return (
    <Card className="w-full max-w-md mb-4 shadow-md dark:border-gray-700 bg-green-50/30 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="mr-2 h-5 w-5 text-green-600" /> {category.name}
        </CardTitle>
        <CardDescription>
          Age Range: {category.min_age} - {category.max_age} years
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-3">
        {requirements.length > 0 && (
          <div>
            <h4 className="font-semibold mb-1 flex items-center text-xs text-gray-500">
              <ListChecks className="mr-1 h-3 w-3" /> Requirements:
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              {requirements.map((req) => (
                <li key={req.id_category_requirement}>
                  {req.requirement_description} (Level: {req.required_level})
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center justify-end">
        <Award className="mr-2 h-4 w-4" />
        Your Level: <Badge variant="default" className="ml-2 bg-green-600 hover:bg-green-700">{userLevel}</Badge>
      </CardFooter>
    </Card>
  );
};

const LoadingSkeletons: React.FC = () => (
  <div className="container mx-auto p-4 space-y-8">
    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div key={`avail-cat-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-2/5 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <Separator />

    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1].map((i) => (
          <div key={`reg-cat-skel-${i}`} className="space-y-3 p-4 border border-green-200 dark:border-green-800 rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-end pt-10">
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
    Use code with caution.
  </div>
);

const ErrorDisplay: React.FC<{ error: Error | null, isRouteError?: boolean }> = ({ error, isRouteError = false }) => (
  <div className="container mx-auto p-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{isRouteError ? "Error Loading Page" : "Error Loading Category Data"}</AlertTitle>
      <AlertDescription>
        There was a problem fetching category information. Please try again later.
        {error?.message && <p className="mt-2 text-xs">Details: {error.message}</p>}
      </AlertDescription>
    </Alert>
  </div>
);
