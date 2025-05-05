import { createFileRoute, ErrorComponentProps, Link } from '@tanstack/react-router'
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { getUserReport, Report } from '@/backend/report_backend';
import UserReportDisplay from '@/components/UserReportDisplay';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/dashboard_trainer/reports/$userId')({
  component: ReportPageComponent,
  loader: async ({ params }) => {
    try {
      console.log(`Fetching report for user: ${params.userId}`);
      const report = await getUserReport(params.userId);
      if (!report) {
        throw new Error("User report not found.");
      }
      return report;
    } catch (error) {
      console.error("Error fetching user report in loader:", error);
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`Report not found for user ID: ${params.userId}`);
      }
      throw new Error(`Failed to load user report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  pendingComponent: LoadingReportSkeleton,
  errorComponent: ReportErrorComponent,
});


function ReportPageComponent() {
  const userReport = Route.useLoaderData();
  const { userId } = Route.useParams();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold">User Report</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard_trainer/reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>

      <UserReportDisplay report={userReport} />
    </div>
  );
}

function LoadingReportSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6 animate-pulse">
      <div className='flex justify-between items-center mb-4'>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
      </div>
      <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
    </div>
  );
}

function ReportErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold text-destructive">Error Loading Report</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard_trainer/reports"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Search</Link>
        </Button>
      </div>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Failed to Load Report</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An unexpected error occurred.'} Please check the user ID or try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
}
