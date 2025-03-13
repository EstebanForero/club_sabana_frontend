import React from 'react'
import { addDays, differenceInDays, format } from 'date-fns'
import { Tuition } from '@/backend/tuition_backend';

interface TuitionDetailsProps {
  tuition: Tuition;
}

const TuitionDetails = ({ tuition }: TuitionDetailsProps) => {
  const paymentDate = new Date(tuition.payment_date);
  const expirationDate = addDays(paymentDate, 30); // Assuming 30-day duration
  const daysLeft = differenceInDays(expirationDate, new Date());

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">Your Active Tuition</h3>
      <div className="text-muted-foreground">
        <p>
          <strong>Amount Paid:</strong> ${tuition.amount}
        </p>
        <p>
          <strong>Payment Date:</strong> {format(paymentDate, 'PPP')}
        </p>
        <p>
          <strong>Expires:</strong> {format(expirationDate, 'PPP')} ({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})
        </p>
      </div>
    </div>
  );
};

export default TuitionDetails
