
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface PaymentOptionsProps {
  onSelectPlan: (amount: number) => void;
  isLoading: boolean;
}

const PaymentOptions = ({ onSelectPlan, isLoading }: PaymentOptionsProps) => {
  const plans = [
    { name: 'Copper', amount: 20, color: 'bg-orange-500' },
    { name: 'Silver', amount: 40, color: 'bg-gray-500' },
    { name: 'Gold', amount: 80, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">You don’t have an active tuition. Please select a plan to pay.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader className={`${plan.color} text-primary-foreground`}>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <p className="text-2xl font-bold text-foreground">${plan.amount}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => onSelectPlan(plan.amount)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
