import { logInUser } from '@/backend/user_backend';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner';
import { AuthManager } from '@/backend/auth';
import { navigateToRol } from '@/lib/utils';
import { useEffect } from 'react';

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function RouteComponent() {
  const navigate = useNavigate({ from: '/auth/login' })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (AuthManager.isAuthenticated()) {
      const userRole = AuthManager.getUserRol()

      if (userRole != null) {
        navigateToRol(userRole, navigate)
      }
    }
  }, [])

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { token, user_rol, user_id } = await logInUser(values);
      console.log("Login successful", { token, user_rol });
      toast.success("Login succesful")
      AuthManager.login(token, user_rol, user_id)
      console.log(`User rol: ${user_rol}`)
      navigateToRol(user_rol, navigate)
    } catch (error) {
      console.error("Login failed", error);
      form.setError("root", {
        type: "manual",
        message: "Invalid credentials",
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
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email or Username"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
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
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
