import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { listCategories, Category } from '@/backend/category_backend';
import { Uuid } from '@/backend/common';

type CategorySelectorProps = {
  value: Uuid | null | undefined;
  onChange: (value: Uuid | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeCategoryId?: Uuid | null;
  className?: string;
};

export const CategorySelector = ({
  value,
  onChange,
  placeholder = "Select category...",
  disabled = false,
  excludeCategoryId,
  className,
}: CategorySelectorProps) => {

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });

  const filteredCategories = useMemo(() => {
    return categories?.filter(cat => cat.id_category !== excludeCategoryId) || [];
  }, [categories, excludeCategoryId]);

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }
  if (isError) {
    return (
      <div className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-destructive", // Mimic SelectTrigger appearance
        "ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}>
        Error loading categories
      </div>
    );
  }

  return (
    <Select
      value={value ?? ""}
      onValueChange={(selectedValue) => {
        onChange(selectedValue || undefined);
      }}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filteredCategories.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">No categories available.</div>
          ) : (
            filteredCategories.map((category) => (
              <SelectItem
                key={category.id_category}
                value={category.id_category}
              >
                {category.name} ({category.min_age}-{category.max_age})
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
