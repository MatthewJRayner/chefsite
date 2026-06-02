"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import { useAuth } from '@/context/AuthContext';

export default function AddRecipePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
            <span className="text-zinc-500 text-sm">Authenticating session...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Create New Recipe</h1>
          <p className="text-zinc-400 text-sm mt-1">Design a new dish, map ingredients, and calculate nutrition.</p>
        </div>

        <RecipeForm />
      </main>
    </div>
  );
}
