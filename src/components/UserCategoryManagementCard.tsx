import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UserInfo } from '@/backend/user_backend';
import { getUserCategories, listCategories, updateUserCategoryLevel, UserCategory, Category } from '@/backend/category_backend';
import { Uuid, LevelName, URol } from '@/backend/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, List, RefreshCw } from 'lucide-react';

interface UserCategoryManagementCardProps {
  user: UserInfo;
}

interface CombinedCategoryInfo {
  category: Category;
  userCategory: UserCategory;
}

const getCategoryName = (id_category: Uuid, allCategories?: Category[]): string => {
  return allCategories?.find(cat => cat.id_category === id_category)?.name || `ID: ${id_category}`;
};

const UserCategoryManagementCard: React.FC<UserCategoryManagementCardProps> = ({ user }) => {
  const queryClient = useQueryClient();

  const {
    data: userCategoriesData,
    isLoading: isLoadingUserCats,
    isError: isErrorUserCats,
    error: errorUserCats
  } = useQuery({
    queryKey: ['userCategories', user.id_user],
    queryFn: () => getUserCategories(user.id_user),
    enabled: !!user.id_user,
    staleTime: 2 * 60 * 1000,
  });
  const userCategories = Array.isArray(userCategoriesData) ? userCategoriesData : [];


  const { data: allCategories, isLoading: isLoadingAllCats } = useQuery({
    queryKey: ['allCategories'],
    queryFn: listCategories,
    staleTime: 60 * 60 * 1000,
    enabled: userCategories.length > 0,
  });

  const updateLevelMutation = useMutation({
    mutationFn: (variables: { categoryId: Uuid; userId: Uuid; levelName: LevelName }) =>
      updateUserCategoryLevel(variables.categoryId, variables.userId, variables.levelName),
    onSuccess: (_, variables) => {
      const categoryName = getCategoryName(variables.categoryId, allCategories);
      toast.success(`Level updated to ${variables.levelName} for user in category "${categoryName}".`);
      queryClient.invalidateQueries({ queryKey: ['userCategories', variables.userId] });
    },
    onError: (error: Error, variables) => {
      const categoryName = getCategoryName(variables.categoryId, allCategories);
      toast.error(`Failed to update level for category "${categoryName}": ${error.message}`);
    },
  });


  const combinedCategoryInfo = useMemo<CombinedCategoryInfo[]>(() => {
    if (isLoadingUserCats || isLoadingAllCats || !userCategories || !allCategories) {
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

  const handleLevelChange = (categoryId: Uuid, newLevel: LevelName) => {
    const currentInfo = combinedCategoryInfo.find(info => info.category.id_category === categoryId);
    if (currentInfo && currentInfo.userCategory.user_level === newLevel) {
      return;
    }
    if (updateLevelMutation.isLoading) return;

    updateLevelMutation.mutate({ categoryId, userId: user.id_user, levelName: newLevel });
  };


  return (
    <Card className='shadow-md hover:shadow-lg transition-shadow dark:border-gray-700 flex flex-col'>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{user.first_name} {user.last_name}</CardTitle>
        <CardDescription className="text-xs">{user.email}</CardDescription>
        <Badge variant="outline" className="mt-1 w-fit text-xs">{user.user_rol}</Badge>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-3">
        <Separator className="mb-3" />
        <h4 className="text-sm font-medium mb-2 flex items-center text-muted-foreground">
          <List className="h-4 w-4 mr-1.5" /> Registered Categories & Levels
        </h4>
        {isLoadingUserCats || (isLoadingAllCats && userCategories.length > 0) ? (
          <div className="space-y-3 mt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isErrorUserCats ? (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Could not load categories for this user.</AlertDescription>
          </Alert>
        ) : combinedCategoryInfo.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">No categories registered.</p>
        ) : (
          <div className="space-y-3">
            {combinedCategoryInfo.map(({ category, userCategory }) => {
              const isUpdatingThis = updateLevelMutation.isLoading &&
                updateLevelMutation.variables?.categoryId === category.id_category;
              return (
                <div key={category.id_category} className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium flex-1 truncate" title={category.name}>
                    {category.name}
                  </span>
                  <div className="w-[150px] flex items-center gap-1">
                    <Select
                      value={userCategory.user_level}
                      onValueChange={(newLevel) => handleLevelChange(category.id_category, newLevel as LevelName)}
                      disabled={isUpdatingThis}
                    >
                      <SelectTrigger className="h-8 text-xs" disabled={isUpdatingThis}>
                        <SelectValue placeholder="Set Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(LevelName).map(level => (
                          <SelectItem key={level} value={level} className="text-xs">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isUpdatingThis && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCategoryManagementCard;
