import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { registerUser } from '@/backend/user_backend';
import { z } from 'zod';
import { IdType } from '@/backend/common';
import { toast } from 'sonner';
import ReusableForm, { FormFieldConfig } from '@/components/ReusableForm';

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

const registerSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }).max(20, { message: 'max lenght is 20' }),
  last_name: z.string().min(1, { message: 'Last name is required' }).max(20, { message: 'max lenght is 20' }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth date must be in YYYY-MM-DD format' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' }).max(20, { message: 'max lenght is 20' })
    .regex(/^\d+$/, { message: 'Phone number must contain only numbers' }),
  country_code: z.string().min(1, { message: 'Country code is required' })
    .max(2, { message: "Country code can't be longer than 2" })
    .regex(/^\d+$/, { message: 'Phone number must contain only numbers' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(30, { message: 'max lenght is 30' }),
  identification_number: z.string().min(1, { message: 'Identification number is required' }).max(14, { message: 'max lenght is 14' }),
  identification_type: z.nativeEnum(IdType, {
    message: 'Please select an identification type',
  }),
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

function RouteComponent() {
  const navigate = useNavigate({ from: '/auth/signin' });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await registerUser(values);
      toast.success('User registered successfully');
      navigate({ to: '/auth/login' });
    } catch (error) {
      toast.error(`Error registering user: ${error}`)
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen px-4">
      <div className="w-full sm:w-[600px] rounded-xl p-8 shadow-xl shadow-primary border border-primary">
        <ReusableForm
          schema={registerSchema}
          defaultValues={{
            first_name: '',
            last_name: '',
            birth_date: '',
            email: '',
            phone_number: '',
            country_code: '',
            password: '',
            identification_number: '',
            identification_type: IdType.CC,
          }}
          onSubmit={onSubmit}
          fields={fields}
          submitButtonText="Register"
        />
      </div>
    </div>
  );
}
