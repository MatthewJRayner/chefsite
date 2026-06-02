"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api, Ingredient, RecipeInput, RecipeIngredientInput } from '@/lib/api';

interface RecipeFormProps {
  initialData?: {
    id: number;
    name: string;
    description: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    culinary_origin: string;
    meal_type: string;
    season: string;
    instructions: string[];
    recipe_ingredients: {
      ingredient: { id: number };
      quantity: string;
      unit: string;
      weight_in_grams: string;
    }[];
  };
}

interface IngredientRow {
  ingredientId: number;
  quantity: string;
  unit: string;
  weightInGrams: string;
}

export default function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter();

  // Recipe Meta fields
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [prepTime, setPrepTime] = useState(initialData?.prep_time?.toString() || '0');
  const [cookTime, setCookTime] = useState(initialData?.cook_time?.toString() || '0');
  const [servings, setServings] = useState(initialData?.servings?.toString() || '1');
  const [origin, setOrigin] = useState(initialData?.culinary_origin || '');
  const [mealType, setMealType] = useState(initialData?.meal_type || 'Dinner');
  const [season, setSeason] = useState(initialData?.season || 'All Year');

  // Instructions state
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions || ['']
  );

  // Ingredients rows state
  const [rows, setRows] = useState<IngredientRow[]>(
    initialData?.recipe_ingredients.map(ri => ({
      ingredientId: ri.ingredient.id,
      quantity: parseFloat(ri.quantity).toString(),
      unit: ri.unit,
      weightInGrams: parseFloat(ri.weight_in_grams).toString()
    })) || []
  );

  // All ingredients in DB (for dropdown selections)
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  
  // Modals / Statuses
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New Ingredient Modal Form values
  const [newIngName, setNewIngName] = useState('');
  const [newIngKcal, setNewIngKcal] = useState('');
  const [newIngProtein, setNewIngProtein] = useState('');
  const [newIngCarbs, setNewIngCarbs] = useState('');
  const [newIngFat, setNewIngFat] = useState('');
  const [newIngFiber, setNewIngFiber] = useState('');
  const [newIngSeason, setNewIngSeason] = useState('All Year');
  const [modalError, setModalError] = useState('');
  const [isModalSaving, setIsModalSaving] = useState(false);

  // Fetch all ingredients for the selector dropdown
  const loadIngredients = async () => {
    try {
      const data = await api.getIngredients();
      setAllIngredients(data);
    } catch (err) {
      console.error('Failed to load ingredients for selector', err);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  // Instruction actions
  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = instructions.filter((_, idx) => idx !== index);
    setInstructions(updated.length ? updated : ['']);
  };

  const handleMoveInstruction = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === instructions.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...instructions];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setInstructions(updated);
  };

  // Ingredient row actions
  const handleAddRow = () => {
    const defaultIngId = allIngredients[0]?.id || 0;
    setRows([...rows, { ingredientId: defaultIngId, quantity: '100', unit: 'g', weightInGrams: '' }]);
  };

  const handleRowChange = (index: number, field: keyof IngredientRow, val: string) => {
    const updated = [...rows];
    if (field === 'ingredientId') {
      updated[index].ingredientId = parseInt(val);
    } else {
      updated[index][field] = val as any;
    }
    setRows(updated);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, idx) => idx !== index));
  };

  // Modal Submission: Create ingredient on the fly
  const handleCreateIngredientOnTheFly = async (e: FormEvent) => {
    e.preventDefault();
    setModalError('');
    setIsModalSaving(true);

    const parsedKcal = parseInt(newIngKcal);
    const parsedProtein = parseFloat(newIngProtein) || 0;
    const parsedCarbs = parseFloat(newIngCarbs) || 0;
    const parsedFat = parseFloat(newIngFat) || 0;
    const parsedFiber = parseFloat(newIngFiber) || 0;

    if (isNaN(parsedKcal)) {
      setModalError('kcal must be a valid number.');
      setIsModalSaving(false);
      return;
    }

    try {
      const newIng = await api.createIngredient({
        name: newIngName,
        kcal: parsedKcal,
        protein: parsedProtein.toFixed(2),
        carbs: parsedCarbs.toFixed(2),
        fat: parsedFat.toFixed(2),
        fiber: parsedFiber.toFixed(2),
        season: newIngSeason,
      });
      
      // Reload ingredients from server to have full updated list
      await loadIngredients();

      // Automatically add this new ingredient to a new row, or append it
      setRows([...rows, {
        ingredientId: newIng.id,
        quantity: '100',
        unit: 'g',
        weightInGrams: ''
      }]);

      // Reset form & close modal
      setNewIngName('');
      setNewIngKcal('');
      setNewIngProtein('');
      setNewIngCarbs('');
      setNewIngFat('');
      setNewIngFiber('');
      setNewIngSeason('All Year');
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || 'Failed to create ingredient.');
    } finally {
      setIsModalSaving(false);
    }
  };

  // Recipe Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    // Validate instructions
    const filteredInstructions = instructions.filter(step => step.trim() !== '');
    if (filteredInstructions.length === 0) {
      setFormError('Please add at least one instruction step.');
      setIsSaving(false);
      return;
    }

    // Format recipe ingredients
    const formattedIngredients: RecipeIngredientInput[] = rows
      .filter(row => row.ingredientId !== 0)
      .map(row => {
        const qty = parseFloat(row.quantity);
        const weight = row.weightInGrams ? parseFloat(row.weightInGrams) : undefined;
        return {
          ingredient_id: row.ingredientId,
          quantity: isNaN(qty) ? 0 : qty,
          unit: row.unit,
          weight_in_grams: weight && !isNaN(weight) ? weight : undefined,
        };
      });

    const payload: RecipeInput = {
      name,
      description,
      prep_time: parseInt(prepTime) || 0,
      cook_time: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 1,
      culinary_origin: origin,
      meal_type: mealType,
      season,
      instructions: filteredInstructions,
      recipe_ingredients: formattedIngredients,
    };

    try {
      if (initialData?.id) {
        await api.updateRecipe(initialData.id, payload);
        router.push(`/recipes/${initialData.id}`);
      } else {
        const newRecipe = await api.createRecipe(payload);
        router.push(`/recipes/${newRecipe.id}`);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save recipe.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-8">
        {formError && (
          <div className="text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl">
            {formError}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-900 pb-3">1. Recipe Details</h3>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Recipe Name</label>
            <input
              type="text"
              required
              placeholder="E.g., Ribeye with Chimichurri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              placeholder="Short description of the recipe, texture, plating style, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-850 focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Prep Time (mins)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Cook Time (mins)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Seasonality</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="All Year">All Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Culinary Origin</label>
              <input
                type="text"
                placeholder="E.g., Italian, Argentinian"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Ingredients Integration */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <h3 className="text-lg font-bold text-white">2. Ingredients</h3>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 px-3 py-1.5 rounded-xl transition-all font-semibold"
            >
              + Create New Ingredient definition
            </button>
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-zinc-500 italic text-center py-4 bg-zinc-950/20 border border-zinc-900 border-dashed rounded-2xl">
              No ingredients selected. Click "Add Ingredient" to begin.
            </p>
          ) : (
            <div className="space-y-4">
              {rows.map((row, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="absolute top-2 right-2 md:static text-zinc-600 hover:text-rose-400 text-xs transition-colors self-center p-1"
                    title="Remove ingredient row"
                  >
                    ✕ Remove
                  </button>

                  {/* Dropdown Selector */}
                  <div className="flex-grow w-full">
                    <label className="block text-3xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Select Ingredient</label>
                    <select
                      value={row.ingredientId}
                      onChange={(e) => handleRowChange(idx, 'ingredientId', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="0" disabled>-- Select Ingredient --</option>
                      {allIngredients.map(ing => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.kcal} kcal/100g)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity input */}
                  <div className="w-full md:w-32">
                    <label className="block text-3xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Qty</label>
                    <input
                      type="text"
                      placeholder="100"
                      value={row.quantity}
                      onChange={(e) => handleRowChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>

                  {/* Unit selector */}
                  <div className="w-full md:w-36">
                    <label className="block text-3xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Unit</label>
                    <select
                      value={row.unit}
                      onChange={(e) => handleRowChange(idx, 'unit', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="g">grams (g)</option>
                      <option value="ml">milliliters (ml)</option>
                      <option value="pcs">pieces (pcs)</option>
                      <option value="tbsp">tablespoons (tbsp)</option>
                      <option value="tsp">teaspoons (tsp)</option>
                    </select>
                  </div>

                  {/* Custom Weight override (for pieces, tbsps, etc.) */}
                  {row.unit !== 'g' && (
                    <div className="w-full md:w-36">
                      <label className="block text-3xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Weight in g</label>
                      <input
                        type="text"
                        placeholder="Weight in grams"
                        value={row.weightInGrams}
                        onChange={(e) => handleRowChange(idx, 'weightInGrams', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-3 bg-zinc-950 border border-zinc-800 border-dashed rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            + Add Ingredient Item
          </button>
        </div>

        {/* Section 3: Step-by-Step Instructions */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-900 pb-3">3. Instructions</h3>
          
          <div className="space-y-4">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl relative">
                {/* Order Index */}
                <span className="text-sm font-extrabold text-amber-500 font-mono mt-3.5">{idx + 1}.</span>
                
                {/* Step Text */}
                <div className="flex-grow">
                  <textarea
                    required
                    placeholder={`Step ${idx + 1} instructions...`}
                    value={step}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors resize-y"
                  />
                </div>

                {/* Step controls */}
                <div className="flex flex-col gap-1.5 self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveInstruction(idx, 'up')}
                    className="text-xs bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 p-1.5 rounded-lg transition-colors border border-zinc-800"
                    title="Move step up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === instructions.length - 1}
                    onClick={() => handleMoveInstruction(idx, 'down')}
                    className="text-xs bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 p-1.5 rounded-lg transition-colors border border-zinc-800"
                    title="Move step down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="text-xs text-rose-500 hover:text-rose-400 p-1.5 font-bold transition-colors"
                    title="Delete step"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddInstruction}
            className="w-full py-3 bg-zinc-950 border border-zinc-800 border-dashed rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            + Add Instruction Step
          </button>
        </div>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-2xl transition-all shadow-md shadow-orange-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? 'Saving Recipe...' : initialData ? 'Save Changes' : 'Create Recipe'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-white font-semibold py-4 px-8 rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* On-the-fly Ingredient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-850 p-6 rounded-3xl relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg transition-colors font-bold"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Create New Ingredient definition</h2>
            
            <form onSubmit={handleCreateIngredientOnTheFly} className="space-y-4">
              {modalError && (
                <div className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Butter"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">kCal / 100g</label>
                  <input
                    type="number"
                    required
                    placeholder="717"
                    value={newIngKcal}
                    onChange={(e) => setNewIngKcal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Protein (g)</label>
                  <input
                    type="text"
                    placeholder="0.9"
                    value={newIngProtein}
                    onChange={(e) => setNewIngProtein(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Carbs (g)</label>
                  <input
                    type="text"
                    placeholder="0.1"
                    value={newIngCarbs}
                    onChange={(e) => setNewIngCarbs(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fat (g)</label>
                  <input
                    type="text"
                    placeholder="81.0"
                    value={newIngFat}
                    onChange={(e) => setNewIngFat(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fiber (g)</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={newIngFiber}
                    onChange={(e) => setNewIngFiber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-2 py-2.5 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Seasonality</label>
                <select
                  value={newIngSeason}
                  onChange={(e) => setNewIngSeason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                  <option value="All Year">All Year</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isModalSaving}
                  className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 disabled:opacity-50"
                >
                  {isModalSaving ? 'Saving Ingredient...' : 'Create & Select'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-zinc-800 text-zinc-400 hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
