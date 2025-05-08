import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Training, TrainingRegistration } from '@/backend/training_backend';
import { formatDate } from '@/lib/utils';
import { CalendarDays, DollarSign, CheckCircle, CalendarCheck, CalendarX } from 'lucide-react';
import EventCourtBadge from './EventCourtBadge';

interface RegisteredTrainingCardProps {
  training: Training;
  registration: TrainingRegistration;
}

const RegisteredTrainingCard: React.FC<RegisteredTrainingCardProps> = ({
  training,
  registration,
}) => {
  return (
    <Card className="w-full max-w-md mb-4 shadow-md dark:border-gray-700 border-l-4 border-blue-500">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{training.name}</CardTitle>
        <CardDescription>Category ID: {training.id_category}</CardDescription>
        <EventCourtBadge eventId={training.id_training} eventType="training" className="mt-1 text-xs" />
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-1.5">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Starts: {formatDate(training.start_datetime)}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Ends: {formatDate(training.end_datetime)}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
          <span>Min. Payment: ${training.minimum_payment?.toFixed(2) ?? 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter className="text-sm font-medium p-3 flex flex-col items-start space-y-1.5 bg-muted/30">
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <CheckCircle className="mr-1.5 h-4 w-4" />
          <span>Registered on: {formatDate(registration.registration_datetime, 'PPp')}</span>
        </div>
        <div className={`flex items-center ${registration.attended ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {registration.attended ? (
            <>
              <CalendarCheck className="mr-1.5 h-4 w-4" />
              <span>Attended on: {formatDate(registration.attendance_datetime, 'PPp')}</span>
            </>
          ) : (
            <>
              <CalendarX className="mr-1.5 h-4 w-4" />
              <span>Attendance not marked</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisteredTrainingCard;
