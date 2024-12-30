// src/app/page.js

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* <Navbar /> */}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Train Reservation System
          </h1>
          <p className="text-gray-600">Book your journey with ease</p>
        </div>
        <div className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}