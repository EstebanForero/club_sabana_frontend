import { createFileRoute, Link } from '@tanstack/react-router'

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllUsers, UserInfo } from '@/backend/user_backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { AlertTriangle, Search, FileText } from 'lucide-react';

export const Route = createFileRoute('/dashboard_trainer/reports/')({
  component: ReportSearchPage,
})

function ReportSearchPage() {
  const [searchEmail, setSearchEmail] = useState('');

  const { data: allUsers, isLoading, isError, error } = useQuery({
    queryKey: ['allUsersForReportSearch'],
    queryFn: getAllUsers,
    staleTime: 10 * 60 * 1000,
  });

  const searchResults = useMemo(() => {
    if (!allUsers || searchEmail.trim() === '') {
      return [];
    }
    const lowerCaseSearch = searchEmail.toLowerCase();
    return allUsers.filter(user =>
      user.email.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allUsers, searchEmail]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Find User Report</h1>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Search by user email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          aria-label="Search user by email"
        />
      </div>

      {isLoading && (
        <div className="space-y-2 pt-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Users</AlertTitle>
          <AlertDescription>
            Could not fetch user list for searching. {error instanceof Error ? error.message : ''}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && searchEmail.trim() !== '' && (
        <div className="border rounded-md">
          <Table>
            <TableCaption>
              {searchResults.length > 0
                ? `Found ${searchResults.length} user(s) matching "${searchEmail}".`
                : `No users found matching "${searchEmail}".`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((user) => (
                <TableRow key={user.id_user}>
                  <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="secondary" size="sm">
                      {/* Link to the dynamic report route */}
                      <Link to="/dashboard_trainer/reports/$userId" params={{ userId: user.id_user }}>
                        <FileText className="mr-2 h-4 w-4" /> View Report
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !isError && searchEmail.trim() === '' && (
        <p className="text-center text-muted-foreground pt-4">
          Enter an email address above to search for a user report.
        </p>
      )}

    </div>
  );
}
