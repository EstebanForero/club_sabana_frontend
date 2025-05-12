import React, { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { getAllUsers, UserInfo } from '@/backend/user_backend';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AdminUserCategoryCard from '@/components/AdminUserCategoryCard';

export const Route = createFileRoute('/dashboard_admin/category_user')({
  component: AdminUserCategoryPage,
});

function AdminUserCategoryPage() {
  const [searchEmail, setSearchEmail] = useState('');

  const { data: allUsers, isLoading, isError, error } = useQuery({
    queryKey: ['allUsersForAdminCategoryMgmt'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];

    if (searchEmail.trim() === '') {
      return [...allUsers].sort((a, b) => a.email.localeCompare(b.email));
    }

    const lowerCaseSearch = searchEmail.toLowerCase();
    return allUsers.filter(user =>
      user.email.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allUsers, searchEmail]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Users className="h-7 w-7 mr-3 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">User Category Management (Admin)</h1>
        </div>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search any user by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="pl-8"
            aria-label="Search user by email"
          />
        </div>
      </div>
      <p className="text-muted-foreground">
        Find users (any role) and view or remove their category registrations.
      </p>


      {isLoading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2 mt-1" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-10 w-full mt-3" /></CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          Error fetching data
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {filteredUsers.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              {filteredUsers.map((user) => (
                <AdminUserCategoryCard key={user.id_user} user={user} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {searchEmail.trim() === ''
                ? 'Enter an email to search for a user.'
                : `No users found matching "${searchEmail}".`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
