import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Training } from '@/backend/training_backend';
import { Uuid } from '@/backend/common';
import { formatDate } from '@/lib/utils';
import { CalendarDays, DollarSign, CheckSquare } from 'lucide-react';
import EventCourtBadge from './EventCourtBadge';

interface AvailableTrainingCardProps {
  training: Training;
  userId: Uuid;
  onRegister: (trainingId: Uuid) => void;
  isRegistering: boolean;
}

const AvailableTrainingCard: React.FC<AvailableTrainingCardProps> = ({
  training,
  userId,
  onRegister,
  isRegistering,
}) => {

  const handleRegisterClick = () => {
    onRegister(training.id_training);
  };

  return (
    <Card className="w-full max-w-md mb-4 shadow-md dark:border-gray-700 flex flex-col justify-between">
      <div>
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
      </div>
      <CardFooter className="flex justify-end pt-4">
        <Button
          onClick={handleRegisterClick}
          disabled={isRegistering}
          size="sm"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          {isRegistering ? 'Registering...' : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableTrainingCard;
