import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listCourts, Court } from '@/backend/court_backend';
import { Uuid } from '@/backend/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CourtSelectorProps {
  value?: Uuid | null;
  onChange: (courtId: Uuid | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const CourtSelector: React.FC<CourtSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a court...",
  disabled = false,
  className,
  error = false,
}) => {
  const { data: courtsData, isLoading, isError } = useQuery({
    queryKey: ['allCourtsForSelection'],
    queryFn: listCourts,
    staleTime: 10 * 60 * 1000,
  });

  const courts = Array.isArray(courtsData) ? courtsData : [];

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }

  if (isError) {
    return <p className="text-xs text-destructive">Error loading courts.</p>;
  }

  return (
    <Select
      onValueChange={(selectedValue) => onChange(selectedValue === "none" ? undefined : selectedValue as Uuid)}
      value={value || "none"}
      disabled={disabled || courts.length === 0}
    >
      <SelectTrigger className={cn(className, error ? "border-destructive" : "")}>
        <SelectValue placeholder={courts.length === 0 && !isLoading ? "No courts available" : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {courts.length === 0 && !isLoading ? (
          <SelectItem value="none" disabled>No courts available</SelectItem>
        ) : (
          <>
            <SelectItem value="none" disabled={!!value}>
              {placeholder}
            </SelectItem>
            {courts.map((court) => (
              <SelectItem key={court.id_court} value={court.id_court}>
                {court.court_name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default CourtSelector;
