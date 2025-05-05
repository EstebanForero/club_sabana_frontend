import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { IdType } from '@/backend/common';
import { UserInfo } from '@/backend/user_backend';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const editUserSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birth date must be YYYY-MM-DD." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone_number: z.string().min(5, { message: "Phone number seems too short." }),
  country_code: z.string().min(1, { message: "Country code is required." }).max(5),
  identification_number: z.string().min(1, { message: "ID number is required." }),
  identification_type: z.nativeEnum(IdType, { errorMap: () => ({ message: "Please select an ID type." }) }),
  password: z.string()
    .optional()
    .or(z.literal(''))
    .refine(val => !val || val.length === 0 || val.length >= 8, {
      message: "Password must be at least 8 characters long if provided.",
    }),
});

export type UserEditFormData = z.infer<typeof editUserSchema>;

interface UserEditFormProps {
  initialData?: UserInfo;
  onSubmit: (data: UserEditFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      birth_date: initialData?.birth_date || '',
      email: initialData?.email || '',
      phone_number: initialData?.phone_number || '',
      country_code: initialData?.country_code || '',
      identification_number: initialData?.identification_number || '',
      identification_type: Object.values(IdType).includes(initialData?.identification_type as IdType)
        ? initialData?.identification_type
        : undefined,
      password: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        birth_date: initialData.birth_date,
        email: initialData.email,
        phone_number: initialData.phone_number,
        country_code: initialData.country_code,
        identification_number: initialData.identification_number,
        identification_type: Object.values(IdType).includes(initialData?.identification_type as IdType)
          ? initialData?.identification_type
          : undefined,
        password: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: UserEditFormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id="user-edit-form" onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">

        {/* First Name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Birth Date */}
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                {/* Consider using shadcn DatePicker for better UX */}
                <Input type="text" placeholder="YYYY-MM-DD" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="1234567890" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Code */}
        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <FormControl>
                <Input placeholder="+1" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identification Number */}
        <FormField
          control={form.control}
          name="identification_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identification Number</FormLabel>
              <FormControl>
                <Input placeholder="ID123456" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identification Type */}
        <FormField
          control={form.control}
          name="identification_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(IdType).map((type) => (
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

        { /* Password (optional) */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  {...field}
                  value={field.value ?? ''}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-1"></div>


      </form>
    </Form>
  );
};

export default UserEditForm;
