export interface Ingredient {
  id: number;
  name: string;
  kcal: number;
  protein: string; // Decimals returned as string in JSON
  carbs: string;
  fat: string;
  fiber: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id?: number;
  ingredient: Ingredient;
  quantity: string;
  unit: string;
  weight_in_grams: string;
}

// Interface for writing recipe ingredients
export interface RecipeIngredientInput {
  ingredient_id: number;
  quantity: number;
  unit: string;
  weight_in_grams?: number;
}

export interface Recipe {
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
  recipe_ingredients: RecipeIngredient[];
  total_kcal: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeInput {
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  culinary_origin: string;
  meal_type: string;
  season: string;
  instructions: string[];
  recipe_ingredients: RecipeIngredientInput[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      throw new Error('Unauthorized: Admin access required.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

export const api = {
  // Ingredients Endpoints
  async getIngredients(search?: string, season?: string): Promise<Ingredient[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (season) params.append('season', season);
    
    const url = `${BASE_URL}/ingredients/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Ingredient[]>(response);
  },

  async createIngredient(data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
    const response = await fetch(`${BASE_URL}/ingredients/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Ingredient>(response);
  },

  async updateIngredient(id: number, data: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
    const response = await fetch(`${BASE_URL}/ingredients/${id}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Ingredient>(response);
  },

  async deleteIngredient(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/ingredients/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },

  // Recipes Endpoints
  async getRecipes(filters?: {
    search?: string;
    meal_type?: string;
    season?: string;
    origin?: string;
    ingredient?: string;
    ordering?: string;
  }): Promise<Recipe[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
    }
    
    const url = `${BASE_URL}/recipes/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Recipe[]>(response);
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await fetch(`${BASE_URL}/recipes/${id}/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Recipe>(response);
  },

  async createRecipe(data: RecipeInput): Promise<Recipe> {
    const response = await fetch(`${BASE_URL}/recipes/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Recipe>(response);
  },

  async updateRecipe(id: number, data: RecipeInput): Promise<Recipe> {
    const response = await fetch(`${BASE_URL}/recipes/${id}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Recipe>(response);
  },

  async deleteRecipe(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/recipes/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },

  // Test Auth Token Validity
  async verifyToken(token: string): Promise<boolean> {
    // We check validity by trying to do a dry-run/empty POST to ingredients.
    // If it fails with 400 (bad data), the token is valid (since it bypassed 401).
    // If it fails with 401/403, the token is invalid.
    try {
      const response = await fetch(`${BASE_URL}/ingredients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}), // Sending empty triggers bad request (400) if authenticated
      });
      
      return response.status === 400;
    } catch {
      return false;
    }
  }
};
