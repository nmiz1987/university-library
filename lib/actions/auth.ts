'use server';

import { signIn } from '@/auth';
import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const signInWithCredentials = async ({ email, password }: Pick<AuthCredentials, 'email' | 'password'>) => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error, 'Signin error');
    return {
      success: false,
      message: 'Signin error',
    };
  }
};

export const signUp = async ({ email, fullName, password, universityCard, universityId }: AuthCredentials) => {
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      message: 'User already exists',
    };
  }

  const hashedPassword = await hash(password, 12);
  try {
    await db.insert(usersTable).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({ email, password });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error, 'Signup error');
    return {
      success: false,
      error: 'Signup error',
    };
  }
};
