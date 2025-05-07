// src/components/selectors/TrainerSelector.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers, UserInfo } from '@/backend/user_backend'; // Adjust path
import { URol, Uuid } from '@/backend/common'; // Adjust path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Your cn utility

interface TrainerSelectorProps {
  value?: Uuid | null; // Current selected trainer_id
  onChange: (trainerId: Uuid | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string; // For custom styling of the trigger
  error?: boolean; // To indicate an error state (e.g., from form validation)
}

const TrainerSelector: React.FC<TrainerSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a trainer...",
  disabled = false,
  className,
  error = false,
}) => {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['allUsersForTrainerSelection'], // Unique query key
    queryFn: getAllUsers,
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    select: (allUsersData) => { // Filter for trainers within the select function
      return allUsersData.filter(user => user.user_rol === URol.TRAINER);
    }
  });

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }

  if (isError) {
    return <p className="text-xs text-destructive">Error loading trainers.</p>;
  }

  const trainers = users || []; // `users` will be the filtered list or undefined

  return (
    <Select
      onValueChange={(selectedValue) => onChange(selectedValue === "none" ? undefined : selectedValue as Uuid)}
      value={value || "none"} // Use "none" or an empty string for placeholder to work with Select
      disabled={disabled || trainers.length === 0}
    >
      <SelectTrigger className={cn(className, error ? "border-destructive" : "")}>
        <SelectValue placeholder={trainers.length === 0 && !isLoading ? "No trainers available" : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {trainers.length === 0 && !isLoading ? (
          <SelectItem value="none" disabled>No trainers available</SelectItem>
        ) : (
          <>
            <SelectItem value="none" disabled={!!value}> {/* Allow unselecting if "none" is valid */}
              {placeholder}
            </SelectItem>
            {trainers.map((trainer) => (
              <SelectItem key={trainer.id_user} value={trainer.id_user}>
                {trainer.first_name} {trainer.last_name} ({trainer.email})
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default TrainerSelector;
