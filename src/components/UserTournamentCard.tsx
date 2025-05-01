// src/components/tournaments/UserTournamentCard.tsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tournament, TournamentRegistration } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Adjust path
import { CalendarDays, Trophy } from 'lucide-react'; // Add relevant icons

// Same date formatting helper
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    // Replace space with 'T' for better cross-browser compatibility with new Date()
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string received:", dateString);
      return dateString; // Return original if invalid
    }
    // Format: Sep 21, 2023, 4:30 PM (adjust 'PPp' as needed)
    return format(date, 'PPp');
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString; // Fallback
  }
};

interface UserTournamentCardProps {
  tournament: Tournament;
  userId: Uuid;
  onRegister: (registrationData: TournamentRegistration) => void; // Callback for registration
  isRegistering: boolean;
}

const UserTournamentCard: React.FC<UserTournamentCardProps> = ({
  tournament,
  userId,
  onRegister,
  isRegistering,
  // isRegistered = false, // Default if using
}) => {

  const handleRegisterClick = () => {
    const registrationData: TournamentRegistration = {
      id_tournament: tournament.id_tournament,
      id_user: userId,
      registration_datetime: getCurrentDateTimeString(), // Get current time
    };
    onRegister(registrationData);
  };

  return (
    <Card className="w-full max-w-md mb-4 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> {tournament.name}
        </CardTitle>
        {/* TODO: Fetch and display category *name* instead of ID for better UX */}
        <CardDescription>Category ID: {tournament.id_category}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Starts: {formatDate(tournament.start_datetime)}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Ends: {formatDate(tournament.end_datetime)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {/* Add logic here if you implement isRegistered check */}
        {/* {isRegistered ? (
                    <span className="text-sm font-medium text-green-600">Registered</span>
                ) : ( */}
        <Button
          onClick={handleRegisterClick}
          disabled={isRegistering} // Disable button if registration is pending for this card
          size="sm"
        >
          {isRegistering ? 'Registering...' : 'Register'}
        </Button>
        {/* )} */}
      </CardFooter>
    </Card>
  );
};

// Helper function (can be moved to utils)
function getCurrentDateTimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 19).replace('T', ' ');
  return localISOTime; // Format: YYYY-MM-DD HH:MM:SS
}


export default UserTournamentCard;
