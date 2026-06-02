"use client";

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { api, Ingredient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');

  // Form states (Add/Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form values
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [formSeason, setFormSeason] = useState('All Year');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getIngredients(search, season);
      setIngredients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load ingredients.');
    } finally {
      setLoading(false);
    }
  }, [search, season]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIngredients();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchIngredients]);

  const handleEditClick = (ing: Ingredient) => {
    setEditingId(ing.id);
    setName(ing.name);
    setKcal(ing.kcal.toString());
    setProtein(ing.protein);
    setCarbs(ing.carbs);
    setFat(ing.fat);
    setFiber(ing.fiber);
    setFormSeason(ing.season);
    setFormError('');
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setName('');
    setKcal('');
    setProtein('');
    setCarbs('');
    setFat('');
    setFiber('');
    setFormSeason('All Year');
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const parsedKcal = parseInt(kcal);
    const parsedProtein = parseFloat(protein) || 0;
    const parsedCarbs = parseFloat(carbs) || 0;
    const parsedFat = parseFloat(fat) || 0;
    const parsedFiber = parseFloat(fiber) || 0;

    if (isNaN(parsedKcal)) {
      setFormError('kcal per 100g must be a number.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      kcal: parsedKcal,
      protein: parsedProtein.toFixed(2),
      carbs: parsedCarbs.toFixed(2),
      fat: parsedFat.toFixed(2),
      fiber: parsedFiber.toFixed(2),
      season: formSeason,
    };

    try {
      if (editingId) {
        await api.updateIngredient(editingId, payload);
      } else {
        await api.createIngredient(payload);
      }
      setShowForm(false);
      fetchIngredients();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save ingredient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await api.deleteIngredient(id);
      fetchIngredients();
    } catch (err: any) {
      setError(err.message || 'Failed to delete ingredient.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Ingredient Database</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage definitions and nutritional metrics per 100g.</p>
          </div>
          {isAuthenticated && !showForm && (
            <button
              onClick={handleAddNewClick}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/10 hover:scale-105"
            >
              + Add Ingredient
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-3xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List Table (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* List Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900/30 border border-zinc-900 p-4 rounded-2xl">
              <input
                type="text"
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="All Year">All Year</option>
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8 animate-pulse h-64" />
            ) : ingredients.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-3xl">
                <span className="text-4xl">🧅</span>
                <h3 className="mt-4 text-lg font-bold text-white">No Ingredients</h3>
                <p className="text-zinc-500 text-sm mt-1">Add ingredients to begin building recipes.</p>
              </div>
            ) : (
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4 text-right">kCal</th>
                        <th className="px-3 py-4 text-right">Prot</th>
                        <th className="px-3 py-4 text-right">Carbs</th>
                        <th className="px-3 py-4 text-right">Fat</th>
                        <th className="px-3 py-4 text-right">Fib</th>
                        <th className="px-6 py-4">Season</th>
                        {isAuthenticated && <th className="px-6 py-4 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-sm">
                      {ingredients.map((ing) => (
                        <tr key={ing.id} className="hover:bg-zinc-900/20 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{ing.name}</td>
                          <td className="px-6 py-4 text-right font-mono font-semibold text-amber-400">{ing.kcal}</td>
                          <td className="px-3 py-4 text-right font-mono text-zinc-300">{parseFloat(ing.protein)}g</td>
                          <td className="px-3 py-4 text-right font-mono text-zinc-300">{parseFloat(ing.carbs)}g</td>
                          <td className="px-3 py-4 text-right font-mono text-zinc-300">{parseFloat(ing.fat)}g</td>
                          <td className="px-3 py-4 text-right font-mono text-zinc-300">{parseFloat(ing.fiber)}g</td>
                          <td className="px-6 py-4">
                            <span className="text-2xs bg-zinc-800 text-zinc-400 border border-zinc-700/60 px-2 py-0.5 rounded-full font-semibold">
                              {ing.season}
                            </span>
                          </td>
                          {isAuthenticated && (
                            <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                              <button
                                onClick={() => handleEditClick(ing)}
                                className="text-xs text-amber-500 hover:text-amber-400 font-bold transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(ing.id)}
                                className="text-xs text-rose-500 hover:text-rose-400 font-bold transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Form Panel (1/3 width, conditional) */}
          <div className="space-y-6">
            {showForm && isAuthenticated ? (
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 shadow-2xl relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg transition-colors"
                >
                  ✕
                </button>
                
                <h2 className="text-xl font-bold text-white mb-6">
                  {editingId ? 'Edit Ingredient' : 'New Ingredient'}
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Extra Virgin Olive Oil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">kCal / 100g</label>
                      <input
                        type="number"
                        required
                        placeholder="884"
                        value={kcal}
                        onChange={(e) => setKcal(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Protein (g)</label>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Carbs (g)</label>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fat (g)</label>
                      <input
                        type="text"
                        placeholder="100.0"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fiber (g)</label>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={fiber}
                        onChange={(e) => setFiber(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Seasonality</label>
                    <select
                      value={formSeason}
                      onChange={(e) => setFormSeason(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Winter">Winter</option>
                      <option value="All Year">All Year</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingId ? 'Update Ingredient' : 'Create Ingredient'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-zinc-900/20 border border-zinc-900 border-dashed rounded-3xl p-8 text-center text-zinc-500">
                <span className="text-2xl">📋</span>
                <p className="text-xs mt-2 leading-relaxed">
                  {isAuthenticated 
                    ? "Click '+ Add Ingredient' or edit an existing one to show the creation panel." 
                    : "Chef login is required to add or modify ingredients in the database."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
