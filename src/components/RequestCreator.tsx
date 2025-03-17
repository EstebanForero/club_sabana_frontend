
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import ReusableForm, { FormFieldConfig } from './ReusableForm'
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest, RequestCreation } from '@/backend/request_backend';
import { toast } from 'sonner';
import { AuthManager } from '@/backend/auth';

const profileSchema = z.object({
  title: z.string().min(4, { message: 'A title is required' }),
  justification: z.string().min(4, { message: 'A justification is required' }),
});

const fields: FormFieldConfig[] = [
  { name: 'title', label: 'Request title', placeholder: 'ex. change user' },
  { name: 'justification', label: 'Request justification', placeholder: 'ex. it does not represent my real name' },
];

type Props = {
  defaultValues?: RequestCreation
}

const RequestCreator = ({ defaultValues }: Props) => {
  const userId = AuthManager.getUserId() ?? ''

  const queryClient = useQueryClient()

  const createRequestMutation = useMutation({
    mutationFn: (request: RequestCreation) => createRequest(request),
    onSuccess: () => {
      toast.success('Request sent successfully');
      queryClient.invalidateQueries({ queryKey: ['requests', userId] })
    },
    onError: (err: Error) => {
      toast.error(`Error sending request: ${err.message}`);
    },
  });

  return (
    <div className='w-full'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Create a new request</CardTitle>
          <CardDescription>Create a request, and send it to the admins</CardDescription>
        </CardHeader>
        <CardContent>
          <ReusableForm schema={profileSchema} fields={fields} onSubmit={(vals) => createRequestMutation.mutateAsync({
            requested_command: vals.title,
            justification: vals.justification,
            requester_id: AuthManager.getUserId() ?? ''
          })}
            defaultValues={{
              title: defaultValues?.requested_command ?? '',
              justification: defaultValues?.justification ?? ''
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestCreator 
