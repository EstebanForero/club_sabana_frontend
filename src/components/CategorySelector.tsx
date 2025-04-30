import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react'; // Can still use for visual cue if desired

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Keep button for trigger if needed, or use SelectTrigger directly
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup, // Optional for grouping
  SelectLabel  // Optional for labeling groups
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { listCategories, Category } from '@/backend/category_backend'; // Adjust path
import { Uuid } from '@/backend/common';

type CategorySelectorProps = {
  value: Uuid | null | undefined; // Currently selected category ID
  onChange: (value: Uuid | undefined) => void; // Callback when selection changes
  placeholder?: string;
  disabled?: boolean;
  excludeCategoryId?: Uuid | null;
  className?: string; // Apply to the SelectTrigger
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

  // Filter categories *before* rendering SelectItems
  const filteredCategories = useMemo(() => {
    return categories?.filter(cat => cat.id_category !== excludeCategoryId) || [];
  }, [categories, excludeCategoryId]);

  // Loading and Error States
  if (isLoading) {
    // Use SelectTrigger dimensions for skeleton
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }
  if (isError) {
    // Display error within the space the selector would take
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
      value={value ?? ""} // Select expects string value, handle null/undefined
      onValueChange={(selectedValue) => {
        // Pass the selected ID (or undefined if placeholder/empty value is selected, though we don't explicitly add one here)
        onChange(selectedValue || undefined);
      }}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={cn("w-full", className)}>
        {/* SelectValue will display the content of the selected SelectItem */}
        {/* It automatically finds the item matching the `value` prop of the parent Select */}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* You can add a placeholder item if needed */}
        {/* <SelectItem value="" disabled>{placeholder}</SelectItem> */}
        <SelectGroup> {/* Good practice even for one group */}
          {filteredCategories.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">No categories available.</div>
          ) : (
            filteredCategories.map((category) => (
              <SelectItem
                key={category.id_category}
                value={category.id_category} // The value must be the ID
              >
                {/* This is the content displayed in the dropdown AND in the SelectValue when selected */}
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
