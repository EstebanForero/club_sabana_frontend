import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { registerUser } from '@/backend/user_backend';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IdType } from '@/backend/common';
import { toast } from 'sonner';

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

const idTypes = Object.values(IdType);

const registerSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth date must be in YYYY-MM-DD format' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' }),
  country_code: z.string().min(1, { message: 'Country code is required' })
    .max(2, { message: "Country code can't be longer than 2" }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  identification_number: z.string().min(1, { message: 'Identification number is required' }),
  identification_type: z.nativeEnum(IdType, {
    message: 'Please select an identification type',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RouteComponent() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      birth_date: '',
      email: '',
      phone_number: '',
      country_code: '',
      password: '',
      identification_number: '',
      identification_type: undefined,
    },
  });

  const navigate = useNavigate({ from: '/auth/signin' })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values);
      console.log('Registration successful');
      toast.success("User registered succesfully")
      navigate({ to: '/auth/login' })
    } catch (error) {
      console.error('Registration failed', error);
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  return (
    <div className='w-full flex items-center justify-center min-h-screen px-4'>
      <div className='w-full sm:w-[600px] rounded-xl p-8 shadow-xl shadow-primary border border-primary'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Country Code (e.g., US)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identification_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select identification type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue={idTypes[0]}>
                      {idTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identification_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Identification Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
