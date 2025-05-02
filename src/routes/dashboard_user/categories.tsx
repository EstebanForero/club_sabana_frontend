import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category, CategoryRequirement, getRequirements, getUserCategories, listCategories, UserCategory } from '@/backend/category_backend'; // Adjust path
import { Users, ListChecks, Target, Award, AlertTriangle } from 'lucide-react'; // Icons
import { LevelName, Uuid } from '@/backend/common';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AuthManager } from '@/backend/auth';
import { useMemo } from 'react';

export const Route = createFileRoute('/dashboard_user/categories')({
  component: RouteComponent,
})


interface AvailableCategoryCardProps {
  category: Category;
  requirements: CategoryRequirement[];
}

export interface EnrichedCategoryData {
  category: Category;
  requirements: CategoryRequirement[];
  userLevel: LevelName | null;
}

function RouteComponent() {
  const userId = AuthManager.getUserId();

  const {
    data: allCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: userCategoryAssignments,
    isLoading: isLoadingUserCats,
    isError: isErrorUserCats,
    error: errorUserCats,
  } = useQuery({
    queryKey: ['userCategories', userId],
    queryFn: () => getUserCategories(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const categoryIds = useMemo(() => allCategories?.map(c => c.id_category) ?? [], [allCategories]);

  const requirementsQueries = useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ['categoryRequirements', id],
      queryFn: () => getRequirements(id),
      staleTime: 10 * 60 * 1000,
      enabled: !!allCategories,
    })),
  });

  const isLoadingRequirements = requirementsQueries.some(q => q.isLoading);
  const isErrorRequirements = requirementsQueries.some(q => q.isError);
  const errorRequirements = requirementsQueries.find(q => q.isError)?.error as Error | undefined;

  const isLoading = isLoadingCategories || (!!userId && isLoadingUserCats) || (!!allCategories && isLoadingRequirements);
  const isError = isErrorCategories || (!!userId && isErrorUserCats) || isErrorRequirements;
  const error = errorCategories || errorUserCats || errorRequirements; // Display the first encountered error

  const enrichedCategories = useMemo<EnrichedCategoryData[]>(() => {
    if (isLoading || isError || !allCategories) {
      return [];
    }

    const userLevelMap = new Map<Uuid, UserCategory>();
    userCategoryAssignments?.forEach(uc => userLevelMap.set(uc.id_category, uc));

    const requirementsMap = new Map<Uuid, CategoryRequirement[]>();
    requirementsQueries.forEach((queryResult, index) => {
      if (queryResult.isSuccess && queryResult.data) {
        const categoryId = categoryIds[index]; // Get corresponding category ID
        requirementsMap.set(categoryId, queryResult.data);
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

  }, [
    allCategories,
    userCategoryAssignments,
    requirementsQueries,
    categoryIds,
    isLoading,
    isError
  ]);

  const registeredCategoryList = enrichedCategories.filter(ec => ec.userLevel !== null);
  const availableCategoryList = enrichedCategories.filter(ec => ec.userLevel === null);

  if (!userId) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            Could not retrieve user information. Please ensure you are logged in correctly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (isError) {
    return <ErrorDisplay error={new Error("Server error loading data")} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Available Categories</h1>
        {availableCategoryList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCategoryList.map(({ category, requirements }) => (
              <AvailableCategoryCard
                key={category.id_category}
                category={category}
                requirements={requirements}
              />
            ))}
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

const AvailableCategoryCard: React.FC<AvailableCategoryCardProps> = ({ category, requirements, }) => {
  return (<Card className="w-full max-w-md mb-4 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700"> <CardHeader> <CardTitle className="text-lg font-semibold flex items-center"> <Users className="mr-2 h-5 w-5 text-blue-500" /> {category.name} </CardTitle> <CardDescription> Age Range: {category.min_age} - {category.max_age} years </CardDescription> </CardHeader> <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-3">
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
    <CardFooter className="text-xs text-gray-500 dark:text-gray-400 justify-end">
      Contact an administrator for assignment to this category.
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
