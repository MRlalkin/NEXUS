'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function register(formData: FormData): Promise<AuthActionResult> {
  const fullName = (formData.get('fullName') as string)?.trim();
  const username = (formData.get('username') as string)?.trim().toLowerCase();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  // Validation
  if (!fullName || fullName.length < 2) {
    return { success: false, error: 'Full name must be at least 2 characters.' };
  }

  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, underscores, and dashes.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`;

  let shouldRedirect = false;
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          avatar_url: avatarUrl,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // If email confirmation is disabled, session is returned immediately
    if (data.session) {
      shouldRedirect = true;
    } else {
      return {
        success: true,
        message: 'Account created! Please check your email to verify your address before logging in.',
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
    return { success: false, error: errorMessage };
  }

  if (shouldRedirect) {
    redirect('/dashboard');
  }

  return { success: true };
}

export async function login(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const redirectTarget = (formData.get('redirect') as string) || '/dashboard';

  if (!email) {
    return { success: false, error: 'Please enter your email.' };
  }

  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  let shouldRedirect = false;
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    shouldRedirect = true;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
    return { success: false, error: errorMessage };
  }

  if (shouldRedirect) {
    redirect(redirectTarget);
  }

  return { success: true };
}

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Logout error:', err);
  }

  redirect('/login');
}

export async function resetPassword(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!email) {
    return { success: false, error: 'Please enter your email address.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const supabase = await createClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Password reset link has been sent to your email.',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email.';
    return { success: false, error: errorMessage };
  }
}
