import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';
import { getUserById, updateUser, UserCreation } from '@/backend/user_backend';
import { IdType, URol } from '@/backend/common';
import ReusableForm, { FormFieldConfig } from '@/components/ReusableForm';
import { createRequest, RequestCreation } from '@/backend/request_backend';
import PremadeRequest from './PremadeRequest';

interface ProfileComponentProps {
  userId: string;
  userRol: URol;
}

const profileSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth date must be in YYYY-MM-DD format' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' }),
  country_code: z.string().min(1, { message: 'Country code is required' }).max(2, { message: "Country code can't be longer than 2" })
    .regex(/^\d+$/, { message: 'Phone number must contain only numbers' }),
  password: z.string(),
  identification_number: z.string().min(1, { message: 'Identification number is required' }),
  identification_type: z.nativeEnum(IdType, { message: 'Please select an identification type' }),
});

const fields: FormFieldConfig[] = [
  { name: 'first_name', label: 'First Name', placeholder: 'First Name' },
  { name: 'last_name', label: 'Last Name', placeholder: 'Last Name' },
  { name: 'birth_date', label: 'Birth Date', type: 'date' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
  { name: 'phone_number', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number' },
  { name: 'country_code', label: 'Country Code', placeholder: 'Country Code (e.g., 57)' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
  {
    name: 'identification_type',
    label: 'Identification Type',
    type: 'select',
    options: Object.values(IdType).map((type) => ({ value: type, label: type })),
    placeholder: 'Select identification type',
  },
  { name: 'identification_number', label: 'Identification Number', placeholder: 'Identification Number' },
];

const ProfileComponent: React.FC<ProfileComponentProps> = ({ userId, userRol }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: UserCreation) => updateUser(userId, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      toast.success('Profile updated successfully');
    },
    onError: (err: Error) => {
      toast.error(`Error updating profile: ${err.message}`);
    },
  });

  const [requestCreation, setRequestCreation] = useState<RequestCreation>()
  const [open, setOpen] = useState(false)

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!user) return <div>User not found</div>;


  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      if (userRol === URol.ADMIN) {
        updateMutation.mutate(values);
      } else {
        const request: RequestCreation = {
          requester_id: userId,
          requested_command: 'Update Profile',
          justification: stringDifference(user, values),
        };

        setOpen(true)
        setRequestCreation(request)
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!user) return <div>User not found</div>;

  const defaultValues = {
    first_name: user.first_name,
    last_name: user.last_name,
    birth_date: user.birth_date,
    email: user.email,
    phone_number: user.phone_number,
    country_code: user.country_code,
    password: '',
    identification_number: user.identification_number,
    identification_type: user.identification_type,
  };

  return (
    <Card className="w-full sm:w-[600px] mx-auto rounded-xl p-8 shadow-xl shadow-primary border border-primary">
      <CardHeader>
        <CardTitle>{user.first_name} {user.last_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ReusableForm
          schema={profileSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          fields={fields}
          submitButtonText={userRol === URol.ADMIN ? 'Update Profile' : 'Request Update'}
        />
        <PremadeRequest requestCreation={requestCreation ?? {
          justification: '',
          requested_command: '',
          requester_id: ''
        }} open={open} onOpenChange={setOpen} />
      </CardContent>
    </Card>
  );
};

export default ProfileComponent;


function formatKey(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function stringDifference<T extends object, S extends object>(original: T, updated: S): string {
  const differences: string[] = [];
  const commonKeys = Object.keys(original).filter(key => updated.hasOwnProperty(key));

  for (const key of commonKeys) {
    if ((original as any)[key] !== (updated as any)[key]) {
      const formattedKey = formatKey(key);
      differences.push(`${formattedKey}: ${(updated as any)[key]}`);
    }
  }

  return differences.join("\n");
}
