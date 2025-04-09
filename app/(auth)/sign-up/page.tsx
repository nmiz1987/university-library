'use client';
import AuthForm from '@/components/AuthForm';
import { signUpSchema } from '@/lib/validations';

export default function Page() {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{ email: '', password: '', fullName: '', universityId: 0, universityCard: '' }}
      onSubmit={() => Promise.resolve({ success: true })}
    />
  );
}
