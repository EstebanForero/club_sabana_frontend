import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { MapPin, AlertCircle } from 'lucide-react';
import { CourtReservation, getCourt, getReservationByTournamentId, getReservationByTrainingId } from '@/backend/court_backend';
import { Uuid } from '@/backend/common';

interface EventCourtBadgeProps {
  eventId: Uuid;
  eventType: 'training' | 'tournament';
  className?: string;
}

const EventCourtBadge: React.FC<EventCourtBadgeProps> = ({
  eventId,
  eventType,
  className,
}) => {
  const {
    data: reservation,
    isLoading: isLoadingReservation,
    isError: isErrorReservation,
    error: reservationError,
  } = useQuery<CourtReservation | null, Error>({
    queryKey: ['eventReservation', eventType, eventId],
    queryFn: async () => {
      if (eventType === 'training') {
        return getReservationByTrainingId(eventId);
      } else {
        return getReservationByTournamentId(eventId);
      }
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if ((error as any)?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const courtId = reservation?.id_court;
  const {
    data: court,
    isLoading: isLoadingCourt,
    isError: isErrorCourt,
    error: courtError,
  } = useQuery({
    queryKey: ['courtDetailsForEvent', courtId],
    queryFn: () => getCourt(courtId!),
    enabled: !!courtId,
    staleTime: Infinity,
  });

  const isLoading = isLoadingReservation || (!!courtId && isLoadingCourt);
  const isError = isErrorReservation || (!!courtId && isErrorCourt);
  const displayError = reservationError || courtError;

  if (isLoading) {
    return <Skeleton className="h-6 w-24 rounded-md" />;
  }

  if (isError) {
    console.error(`Error fetching court for ${eventType} ${eventId}:`, displayError);
    return (
      <Badge variant="destructive" className={className}>
        <AlertCircle className="mr-1 h-3 w-3" /> Error
      </Badge>
    );
  }

  if (!reservation || !courtId) {
    return (
      <Badge variant="outline" className={className}>
        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" /> No Court
      </Badge>
    );
  }

  if (!court) {
    return (
      <Badge variant="secondary" className={className}>
        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" /> Court ID: {courtId.substring(0, 6)}...
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={className}>
      <MapPin className="mr-1 h-3 w-3" />
      {court.court_name}
    </Badge>
  );
};

export default EventCourtBadge;
