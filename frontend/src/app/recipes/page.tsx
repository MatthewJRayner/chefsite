"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api, Recipe } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('');
  const [season, setSeason] = useState('');
  const [origin, setOrigin] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const { isAuthenticated } = useAuth();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRecipes({
        search,
        meal_type: mealType,
        season,
        origin,
        ingredient,
        ordering,
      });
      setRecipes(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, [search, mealType, season, origin, ingredient, ordering]);

  // Fetch when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecipes();
    }, 300); // Debounce API calls for search query typing

    return () => clearTimeout(delayDebounceFn);
  }, [fetchRecipes]);

  const clearFilters = () => {
    setSearch('');
    setMealType('');
    setSeason('');
    setOrigin('');
    setIngredient('');
    setOrdering('-created_at');
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Recipe Journal</h1>
            <p className="text-zinc-400 text-sm mt-1">Explore precise recipes, cooking steps, and detailed nutritional stats.</p>
          </div>
          {isAuthenticated && (
            <Link
              href="/recipes/add"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/10 hover:scale-105"
            >
              + Create Recipe
            </Link>
          )}
        </div>

        {/* Filters and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 h-fit space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search</label>
              <input
                type="text"
                placeholder="Recipe name/keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Filter by Ingredient */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ingredient</label>
              <input
                type="text"
                placeholder="Tomato, Cheese..."
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Meal Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">All Meals</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Seasonality */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Seasonality</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="All Year">All Year</option>
              </select>
            </div>

            {/* Culinary Origin */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Origin</label>
              <input
                type="text"
                placeholder="Italian, Indian..."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sort By</label>
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
                <option value="prep_time">Prep Time (Low-High)</option>
                <option value="cook_time">Cook Time (Low-High)</option>
              </select>
            </div>
          </div>

          {/* Recipes Catalog Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-3xl mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 h-64 animate-pulse" />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-3xl">
                <span className="text-4xl">🍽️</span>
                <h3 className="mt-4 text-lg font-bold text-white">No Recipes Found</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-xs mx-auto">Try clearing filters or search keywords to view recipes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-3xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between"
                  >
                    <div>
                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-2xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                          {recipe.meal_type}
                        </span>
                        <span className="text-2xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">
                          {recipe.season}
                        </span>
                        {recipe.culinary_origin && (
                          <span className="text-2xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
                            {recipe.culinary_origin}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {recipe.name}
                      </h3>
                      
                      <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {recipe.description || 'No description provided.'}
                      </p>

                      {/* Timings */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                        <span>⏱️ Prep: {recipe.prep_time}m</span>
                        <span>🔥 Cook: {recipe.cook_time}m</span>
                        <span>👥 Servings: {recipe.servings}</span>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-900/80 pt-4">
                      {/* Macros Quick Info */}
                      <div className="flex items-center justify-between text-2xs font-mono text-zinc-400 bg-zinc-950/40 p-2 rounded-2xl border border-zinc-900">
                        <span className="font-semibold text-white">{recipe.total_kcal} kcal</span>
                        <span>P: {recipe.total_protein}g</span>
                        <span>C: {recipe.total_carbs}g</span>
                        <span>F: {recipe.total_fat}g</span>
                        <span>Fi: {recipe.total_fiber}g</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between mt-4">
                        <Link
                          href={`/recipes/${recipe.id}`}
                          className="text-xs font-bold text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-full transition-all"
                        >
                          View Recipe
                        </Link>
                        {isAuthenticated && (
                          <Link
                            href={`/recipes/${recipe.id}/edit`}
                            className="text-xs font-bold text-amber-500 hover:text-amber-400 px-3 py-1.5 rounded-full transition-colors"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
