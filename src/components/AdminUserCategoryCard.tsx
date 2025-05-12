import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UserInfo } from '@/backend/user_backend';
import {
  getUserCategories,
  listCategories,
  deleteUserFromCategory,
  UserCategory,
  Category
} from '@/backend/category_backend';
import { Uuid, LevelName, URol } from '@/backend/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, List, Trash2, RefreshCw } from 'lucide-react';

interface AdminUserCategoryCardProps {
  user: UserInfo;
}

interface CombinedCategoryInfo {
  category: Category;
  userCategory: UserCategory;
}

const getCategoryName = (id_category: Uuid, allCategories?: Category[]): string => {
  return allCategories?.find(cat => cat.id_category === id_category)?.name || `ID: ${id_category}`;
};

const AdminUserCategoryCard: React.FC<AdminUserCategoryCardProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const [deletingCategoryId, setDeletingCategoryId] = useState<Uuid | null>(null);

  const {
    data: userCategoriesData,
    isLoading: isLoadingUserCats,
    isError: isErrorUserCats,
    refetch: refetchUserCategories
  } = useQuery({
    queryKey: ['userCategoriesAdmin', user.id_user],
    queryFn: () => getUserCategories(user.id_user),
    enabled: !!user.id_user,
    staleTime: 1 * 60 * 1000,
  });
  const userCategories = Array.isArray(userCategoriesData) ? userCategoriesData : [];

  const { data: allCategories, isLoading: isLoadingAllCats } = useQuery({
    queryKey: ['allCategories'],
    queryFn: listCategories,
    staleTime: 60 * 60 * 1000,
    enabled: userCategories.length > 0,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (variables: { categoryId: Uuid; userId: Uuid }) =>
      deleteUserFromCategory(variables.categoryId, variables.userId),
    onSuccess: (_, variables) => {
      const categoryName = getCategoryName(variables.categoryId, allCategories);
      toast.success(`User removed from category "${categoryName}".`);
      queryClient.invalidateQueries({ queryKey: ['userCategoriesAdmin', variables.userId] });
    },
    onError: (error: Error, variables) => {
      const categoryName = getCategoryName(variables.categoryId, allCategories);
      toast.error(`Failed to remove from category "${categoryName}": ${error.message}`);
    },
    onSettled: () => {
      setDeletingCategoryId(null);
    }
  });

  const handleDeleteClick = (categoryId: Uuid) => {
    if (deleteCategoryMutation.isLoading) return;
    setDeletingCategoryId(categoryId);
    deleteCategoryMutation.mutate({ categoryId, userId: user.id_user });
  };

  const combinedCategoryInfo = useMemo<CombinedCategoryInfo[]>(() => {
    if (isLoadingUserCats || (isLoadingAllCats && userCategories.length > 0) || !allCategories) {
      return [];
    }
    return userCategories
      .map(uc => {
        const category = allCategories.find(cat => cat.id_category === uc.id_category);
        return category ? { category, userCategory: uc } : null;
      })
      .filter((item): item is CombinedCategoryInfo => item !== null)
      .sort((a, b) => a.category.name.localeCompare(b.category.name));

  }, [userCategories, allCategories, isLoadingUserCats, isLoadingAllCats]);

  return (
    <Card className='shadow-md hover:shadow-lg transition-shadow dark:border-gray-700 flex flex-col'>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{user.first_name} {user.last_name}</CardTitle>
        <CardDescription className="text-xs">{user.email} <Badge variant="outline" className='ml-2'>{user.user_rol}</Badge></CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-3">
        <Separator className="mb-3" />
        <h4 className="text-sm font-medium mb-2 flex items-center text-muted-foreground">
          <List className="h-4 w-4 mr-1.5" /> Registered Categories
        </h4>
        {isLoadingUserCats || (isLoadingAllCats && userCategories.length > 0) ? (
          <div className="space-y-3 mt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isErrorUserCats ? (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Load Error</AlertTitle>
            <AlertDescription className="text-xs">Could not load categories for this user.</AlertDescription>
            <Button variant="link" size="sm" onClick={() => refetchUserCategories()} className="h-auto p-0 mt-1 text-xs">Retry</Button>
          </Alert>
        ) : combinedCategoryInfo.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">Not registered in any categories.</p>
        ) : (
          <div className="space-y-2">
            {combinedCategoryInfo.map(({ category, userCategory }) => {
              const isDeletingThis = deletingCategoryId === category.id_category;
              return (
                <div key={category.id_category} className="flex items-center justify-between gap-2 text-sm p-2 rounded-md border bg-muted/30">
                  <div className="flex-1 space-y-0.5">
                    <span className="font-medium block truncate" title={category.name}>
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">{userCategory.user_level}</Badge>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        disabled={isDeletingThis}
                        aria-label={`Remove user from ${category.name}`}
                      >
                        {isDeletingThis ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove <strong>{user.first_name} {user.last_name}</strong> from the category <strong>"{category.name}"</strong>? This action cannot be undone easily.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteClick(category.id_category)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUserCategoryCard;
