import { AuthManager } from '@/backend/auth';
import { hasActiveTuition, listUserTuitions, payTuition } from '@/backend/tuition_backend';
import PaymentOptions from '@/components/PaymentOptions';
import TuitionDetails from '@/components/TuitionDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard_user/tuition')({
  component: RouteComponent,
  loader: () => {
    const logInInfo = AuthManager.getLogInInfo()

    if (!logInInfo) {
      throw redirect({
        to: '/auth/login'
      })
    }

    return logInInfo
  }
})

function RouteComponent() {
  const queryClient = useQueryClient();

  const { user_id: userId } = Route.useLoaderData()

  const { data: hasActive, isLoading: isCheckingActive, error: activeError } = useQuery({
    queryKey: ['hasActiveTuition', userId],
    queryFn: () => hasActiveTuition(userId),
  });

  const { data: tuitions, isLoading: isLoadingTuitions, error: tuitionsError } = useQuery({
    queryKey: ['userTuitions', userId],
    queryFn: () => listUserTuitions(userId),
    enabled: hasActive === true,
  });

  const payMutation = useMutation({
    mutationFn: (amount: number) => payTuition(amount),
    onSuccess: () => {
      toast.success('Tuition paid successfully');
      queryClient.invalidateQueries(['hasActiveTuition', userId]);
      queryClient.invalidateQueries(['userTuitions', userId]);
    },
    onError: (error: Error) => {
      toast.error(`Error paying tuition: ${error.message}`);
    },
  });


  const activeTuition = useMemo(() => {
    if (tuitions && tuitions.length > 0) {
      return [...tuitions]
        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];
    }
    return null;
  }, [tuitions]);

  if (isCheckingActive || (hasActive && isLoadingTuitions)) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (activeError || tuitionsError) {
    return (
      <div className="text-destructive text-center">
        Error: {(activeError as Error)?.message || (tuitionsError as Error)?.message}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-4 shadow-primary shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Tuition Status</CardTitle>
      </CardHeader>
      <CardContent>
        {hasActive && activeTuition ? (
          <TuitionDetails tuition={activeTuition} />
        ) : (
          <PaymentOptions onSelectPlan={payMutation.mutate} isLoading={payMutation.isLoading} />
        )}
      </CardContent>
    </Card>
  );
}

