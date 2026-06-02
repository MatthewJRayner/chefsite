"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api, Recipe } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const recipeId = parseInt(id);
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await api.getRecipe(recipeId);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await api.deleteRecipe(recipeId);
      router.push('/recipes');
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipe.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
            <span className="text-zinc-500 text-sm">Loading recipe details...</span>
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

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Admin Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/recipes" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            &larr; Back to Catalog
          </Link>
          
          {isAuthenticated && (
            <div className="flex gap-4">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
              >
                Edit Recipe
              </Link>
              <button
                onClick={handleDelete}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
              >
                Delete Recipe
              </button>
            </div>
          )}
        </div>

        {/* Recipe Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Title, Description, Instructions) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  {recipe.meal_type}
                </span>
                <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  {recipe.season}
                </span>
                {recipe.culinary_origin && (
                  <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                    {recipe.culinary_origin}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-white leading-tight">{recipe.name}</h1>
              <p className="text-zinc-400 text-base mt-4 leading-relaxed whitespace-pre-line">{recipe.description || 'No description provided.'}</p>
            </div>

            {/* Timings card */}
            <div className="grid grid-cols-3 gap-4 bg-zinc-900/30 border border-zinc-900 rounded-3xl p-6 text-center">
              <div>
                <span className="block text-2xs text-zinc-500 uppercase tracking-wider">Prep Time</span>
                <span className="block text-xl font-bold text-white mt-1">{recipe.prep_time}m</span>
              </div>
              <div className="border-x border-zinc-900">
                <span className="block text-2xs text-zinc-500 uppercase tracking-wider">Cook Time</span>
                <span className="block text-xl font-bold text-white mt-1">{recipe.cook_time}m</span>
              </div>
              <div>
                <span className="block text-2xs text-zinc-500 uppercase tracking-wider">Servings</span>
                <span className="block text-xl font-bold text-white mt-1">{recipe.servings}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Instructions</h2>
              {recipe.instructions.length === 0 ? (
                <p className="text-zinc-500 text-sm italic">No instructions provided.</p>
              ) : (
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-4 items-start bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl">
                      <span className="text-lg font-bold text-amber-500 font-mono leading-none pt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Sidebar (Ingredients & Nutrition) */}
          <div className="space-y-8">
            {/* Ingredients Card */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Ingredients</h2>
              {recipe.recipe_ingredients.length === 0 ? (
                <p className="text-zinc-500 text-sm italic">No ingredients listed.</p>
              ) : (
                <ul className="space-y-3 divide-y divide-zinc-900">
                  {recipe.recipe_ingredients.map((ri) => (
                    <li key={ri.id} className="flex justify-between items-start pt-3 first:pt-0">
                      <div>
                        <span className="block text-sm font-semibold text-zinc-100">{ri.ingredient.name}</span>
                        {ri.unit !== 'g' && ri.weight_in_grams && (
                          <span className="block text-3xs text-zinc-500 font-mono mt-0.5">({ri.weight_in_grams}g)</span>
                        )}
                      </div>
                      <span className="text-sm font-mono text-amber-400 font-bold">
                        {parseFloat(ri.quantity)} {ri.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Nutrition Card */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6">
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-xl font-bold text-white">Nutrition</h2>
                <span className="text-2xs text-zinc-500 font-mono">(Totals for Recipe)</span>
              </div>

              {/* Big Calories display */}
              <div className="text-center py-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl mb-6">
                <span className="block text-4xl font-extrabold text-white tracking-tight">{recipe.total_kcal}</span>
                <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mt-1">Total kCal</span>
              </div>

              {/* Macro Bars */}
              <div className="space-y-4 font-mono text-sm">
                {/* Protein */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-sans">Protein</span>
                    <span className="text-white font-bold">{recipe.total_protein}g</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(recipe.total_protein * 2, 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-sans">Carbohydrates</span>
                    <span className="text-white font-bold">{recipe.total_carbs}g</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(recipe.total_carbs * 2, 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Fat */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-sans">Fat</span>
                    <span className="text-white font-bold">{recipe.total_fat}g</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(recipe.total_fat * 2, 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Fiber */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-sans">Fiber</span>
                    <span className="text-white font-bold">{recipe.total_fiber}g</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(recipe.total_fiber * 4, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
