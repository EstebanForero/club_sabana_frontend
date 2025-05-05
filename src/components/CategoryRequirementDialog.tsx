import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash2, PlusCircle, ListChecks } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ALL_LEVELS, Uuid, LevelName } from '@/backend/common';
import {
  CategoryRequirement,
  addRequirement,
  getRequirements,
  listCategories,
  Category,
  deleteRequirement,
  DeleteParams,
} from '@/backend/category_backend';

import CategorySelector from './CategorySelector';

const requirementCreationSchema = z.object({
  prerequisite_category_id: z.string().uuid({ message: "Please select a required category." }),
  required_level: z.nativeEnum(LevelName, {
    errorMap: () => ({ message: "Please select a level." })
  }),
});

type RequirementFormData = z.infer<typeof requirementCreationSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: Uuid | null;
  categoryName: string | null;
};

const CategoryRequirementsDialog = ({ isOpen, onOpenChange, categoryId, categoryName }: Props) => {
  const queryClient = useQueryClient();
  const addForm = useForm<RequirementFormData>({
    resolver: zodResolver(requirementCreationSchema),
    defaultValues: {
      prerequisite_category_id: undefined,
      required_level: undefined,
    },
  });

  const {
    data: requirements,
    isLoading: isLoadingRequirements,
    isError: isErrorRequirements,
    error: errorRequirements
  } = useQuery({
    queryKey: ['requirements', categoryId],
    queryFn: () => getRequirements(categoryId!),
    enabled: !!categoryId && isOpen,
    staleTime: 1 * 60 * 1000,
  });

  const { data: allCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
  });

  const categoryMap = useMemo(() => {
    if (!allCategories) return new Map<Uuid, string>();
    return new Map(allCategories.map(cat => [cat.id_category, cat.name]));
  }, [allCategories]);
  const getCategoryName = (id: Uuid): string => categoryMap.get(id) || 'Unknown Category';


  const addMutation = useMutation({
    mutationFn: addRequirement,
    onSuccess: (newRequirementData) => {
      const prereqName = getCategoryName(newRequirementData.id_category_requirement);
      toast.success(`Requirement added: ${prereqName} (${newRequirementData.required_level})`);
      queryClient.invalidateQueries({ queryKey: ['requirements', categoryId] });
      addForm.reset();
    },
    onError: (error: Error) => {
      console.error("Error adding requirement:", error);
      toast.error(`Failed to add requirement: ${error.message || 'Unknown error'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRequirement,
    onSuccess: () => {
      toast.success('Requirement deleted successfully.');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['requirements', categoryId] });
      }, 100)
    },
    onError: (error: Error) => {
      console.error("Error deleting requirement:", error);
      toast.error(`Failed to delete requirement: ${error.message || 'Unknown error'}`);
    },
  });

  function onAddSubmit(values: RequirementFormData) {
    if (!categoryId) return;
    const targetCategoryId = categoryId;
    const prerequisiteCategoryId = values.prerequisite_category_id;
    const prerequisiteCategoryName = getCategoryName(prerequisiteCategoryId);
    const payload: CategoryRequirement = {
      id_category_requirement: prerequisiteCategoryId,
      id_category: targetCategoryId,
      required_level: values.required_level,
      requirement_description: `Requires ${prerequisiteCategoryName} (${values.required_level})`,
    };
    addMutation.mutate(payload);
  }

  const handleDelete = (prerequisiteCategoryIdToDelete: Uuid) => {
    if (!categoryId) return;
    const deleteParams: DeleteParams = {
      categoryId: categoryId,
      categoryReqId: prerequisiteCategoryIdToDelete
    };
    deleteMutation.mutate(deleteParams);
  };


  const renderContent = () => {
    if (!categoryId) return null;

    if (isLoadingRequirements || isLoadingCategories) {
      return <Skeleton className="h-40 w-full" />;
    }

    if (isErrorRequirements) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Requirements</AlertTitle>
          <AlertDescription>{errorRequirements instanceof Error ? errorRequirements.message : 'Could not fetch requirements.'}</AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Current Requirements For "{categoryName}"</h4>
          {requirements && requirements.length > 0 ? (
            <ScrollArea className="h-[150px] border rounded-md p-2">
              <ul className="space-y-2">
                {requirements.map((req) => {
                  const prerequisiteId = req.id_category_requirement;
                  const prerequisiteName = getCategoryName(prerequisiteId);
                  const requirementKey = `${req.id_category}-${req.id_category_requirement}-${req.required_level}`;

                  const isDeletingThis = deleteMutation.isLoading &&
                    deleteMutation.variables?.categoryId === categoryId &&
                    deleteMutation.variables?.categoryReqId === prerequisiteId;

                  return (
                    <li key={requirementKey} className="flex justify-between items-center text-sm p-2 hover:bg-muted/50 rounded">
                      <span>
                        Requires: <strong>{prerequisiteName}</strong> (Level: {req.required_level})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(prerequisiteId)}
                        // *** Use.isLoading and check variables correctly ***
                        disabled={isDeletingThis}
                        aria-label={`Delete requirement for ${prerequisiteName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No specific requirements added yet.</p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="mb-4">
          <h4 className="text-md font-semibold mb-3">Add New Requirement</h4>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div>
              <Label className='mb-3'>Required Category</Label>
              <Controller
                name="prerequisite_category_id"
                control={addForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <CategorySelector
                      value={field.value}
                      onChange={field.onChange}
                      excludeCategoryId={categoryId}
                      placeholder="Select prerequisite category..."
                      disabled={addMutation.isLoading || isLoadingCategories}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                    {fieldState.error && <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div>
              <Label className='mb-3'>Required Level</Label>
              <Controller
                name="required_level"
                control={addForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={addMutation.isLoading}
                    >
                      <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select minimum level" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_LEVELS.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <Button type="submit" disabled={addMutation.isLoading} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              {addMutation.isLoading ? 'Adding...' : 'Add Requirement'}
            </Button>
          </form>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5" /> Manage Requirements for "{categoryName || 'Category'}"
          </DialogTitle>
          <DialogDescription>
            Define which other categories and levels a user must achieve before joining this one.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryRequirementsDialog;
