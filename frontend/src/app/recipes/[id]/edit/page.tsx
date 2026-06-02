"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import { useAuth } from '@/context/AuthContext';
import { api, Recipe } from '@/lib/api';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditRecipePage({ params }: PageProps) {
  const { id } = use(params);
  const recipeId = parseInt(id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await api.getRecipe(recipeId);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe details.');
      } finally {
        setLoadingRecipe(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);

  if (isAuthLoading || loadingRecipe || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
            <span className="text-zinc-500 text-sm">
              {isAuthLoading ? 'Authenticating session...' : 'Loading recipe data...'}
            </span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="max-w-md bg-zinc-900/50 border border-zinc-900 p-8 rounded-3xl text-center">
            <span className="text-4xl">⚠️</span>
            <h2 className="mt-4 text-xl font-bold text-white">Error Loading Recipe</h2>
            <p className="text-zinc-500 text-sm mt-2">{error || 'Recipe not found.'}</p>
            <Link 
              href="/recipes" 
              className="mt-6 inline-block bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            >
              Back to Catalog
            </Link>
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
          <h1 className="text-3xl font-extrabold text-white">Edit Recipe</h1>
          <p className="text-zinc-400 text-sm mt-1">Modify details for: <span className="text-amber-400 font-bold">{recipe.name}</span></p>
        </div>

        <RecipeForm initialData={recipe} />
      </main>
    </div>
  );
}
