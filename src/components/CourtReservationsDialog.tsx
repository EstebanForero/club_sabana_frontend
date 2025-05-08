import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { getReservationsForCourt, CourtReservation, Court } from '@/backend/court_backend';
import { Uuid } from '@/backend/common';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, CalendarSearch, FilterX, Link as LinkIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface CourtReservationsDialogProps {
  court: Court | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatToDateTimeLocal = (isoString?: string | null): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};

const formatToBackendDateTime = (dateTimeLocalString: string): string | undefined => {
  if (!dateTimeLocalString) return undefined;
  try {
    const date = new Date(dateTimeLocalString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return undefined;
  }
};


const CourtReservationsDialog: React.FC<CourtReservationsDialogProps> = ({
  court,
  isOpen,
  onOpenChange,
}) => {
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  const {
    data: reservations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courtReservations', court?.id_court, startDateFilter, endDateFilter],
    queryFn: () => {
      if (!court?.id_court) return Promise.resolve([]);
      return getReservationsForCourt(court.id_court, {
        start_datetime_filter: formatToBackendDateTime(startDateFilter),
        end_datetime_filter: formatToBackendDateTime(endDateFilter),
      });
    },
    enabled: !!court && isOpen,
    staleTime: 1 * 60 * 1000,
  });

  const handleApplyFilters = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setStartDateFilter('');
    setEndDateFilter('');
    // Refetch will happen automatically due to queryKey change, or explicitly call refetch()
    // setTimeout(() => refetch(), 0); // Ensure state updates before refetch if needed
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 py-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive" className='my-4'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Reservations</AlertTitle>
          <AlertDescription>
            Could not fetch reservations. {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!reservations || reservations.length === 0) {
      return <p className="text-muted-foreground text-center py-6">No reservations found for the selected criteria.</p>;
    }

    return (
      <ScrollArea className="max-h-[60vh] mt-4">
        <Table>
          <TableCaption>Reservations for {court?.court_name || 'this court'}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.id_court_reservation}>
                <TableCell>{formatDate(res.start_reservation_datetime, 'PPp')}</TableCell>
                <TableCell>{formatDate(res.end_reservation_datetime, 'PPp')}</TableCell>
                <TableCell>
                  {res.id_training && <Badge variant="outline">Training</Badge>}
                  {res.id_tournament && <Badge variant="secondary">Tournament</Badge>}
                  {!res.id_training && !res.id_tournament && <span className='text-xs italic'>Manual</span>}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {res.id_training || res.id_tournament || res.id_court_reservation.substring(0, 8) + '...'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Reservations for: {court?.court_name || "Court"}</DialogTitle>
          <DialogDescription>
            View all scheduled reservations. Use filters to narrow down the results.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 border rounded-md bg-muted/30">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <CalendarSearch className="h-4 w-4 mr-2" /> Filter Reservations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date-filter" className="text-xs">Start Date/Time From</Label>
              <Input
                id="start-date-filter"
                type="datetime-local"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="end-date-filter" className="text-xs">End Date/Time Until</Label>
              <Input
                id="end-date-filter"
                type="datetime-local"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleClearFilters} disabled={!startDateFilter && !endDateFilter}>
              <FilterX className="h-3.5 w-3.5 mr-1.5" /> Clear Filters
            </Button>
            <Button variant="default" size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>

        {renderContent()}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourtReservationsDialog;
