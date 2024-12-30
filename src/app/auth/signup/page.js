'use client';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-gray-600 mt-1">
              Sign up to start booking train seats
            </p>
          </div>
          <SignupForm />
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}