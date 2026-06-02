from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Ingredient, Recipe, RecipeIngredient, Season, MealType, Unit

class RecipeAPITests(APITestCase):
    def setUp(self):
        # Set up default test secret key
        # In testing settings, ADMIN_API_KEY defaults to 'dev-secret-key-123'
        self.admin_token = 'dev-secret-key-123'
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        self.bad_auth_headers = {'HTTP_AUTHORIZATION': 'Bearer wrong-secret'}

        # Create some ingredients
        self.tomato = Ingredient.objects.create(
            name="Tomato",
            kcal=18,
            protein=0.9,
            carbs=3.9,
            fat=0.2,
            fiber=1.2,
            season=Season.SUMMER
        )
        self.mozzarella = Ingredient.objects.create(
            name="Mozzarella",
            kcal=280,
            protein=22.0,
            carbs=2.0,
            fat=20.0,
            fiber=0.0,
            season=Season.ALL_YEAR
        )
        self.basil = Ingredient.objects.create(
            name="Basil",
            kcal=23,
            protein=3.2,
            carbs=2.7,
            fat=0.6,
            fiber=1.6,
            season=Season.SUMMER
        )

        # Create a recipe (Caprese Salad)
        self.caprese = Recipe.objects.create(
            name="Caprese Salad",
            description="Fresh and simple Italian salad",
            prep_time=5,
            cook_time=0,
            servings=2,
            culinary_origin="Italian",
            meal_type=MealType.SNACK,
            season=Season.SUMMER,
            instructions=["Slice tomatoes and mozzarella.", "Layer them alternately on a plate.", "Top with basil and drizzle with olive oil."]
        )
        
        # Add ingredients with quantities to the recipe
        RecipeIngredient.objects.create(
            recipe=self.caprese,
            ingredient=self.tomato,
            quantity=100.0,
            unit=Unit.GRAMS
        )
        RecipeIngredient.objects.create(
            recipe=self.caprese,
            ingredient=self.mozzarella,
            quantity=50.0,
            unit=Unit.GRAMS
        )
        # Using pcs to test weight_in_grams override
        RecipeIngredient.objects.create(
            recipe=self.caprese,
            ingredient=self.basil,
            quantity=5.0,
            unit=Unit.PIECES,
            weight_in_grams=10.0
        )

    def test_get_ingredients_list_public(self):
        """Anyone can list ingredients without a token."""
        url = reverse('ingredient-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_post_ingredient_requires_auth(self):
        """Creating an ingredient requires a valid token."""
        url = reverse('ingredient-list')
        data = {
            "name": "Olive Oil",
            "kcal": 884,
            "protein": 0.0,
            "carbs": 0.0,
            "fat": 100.0,
            "fiber": 0.0,
            "season": Season.ALL_YEAR
        }
        
        # No token -> 401 Unauthorized or 403 Forbidden
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Wrong token -> 401 Unauthorized
        response = self.client.post(url, data, **self.bad_auth_headers)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Correct token -> 201 Created
        response = self.client.post(url, data, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ingredient.objects.count(), 4)

    def test_recipe_dynamic_nutritional_calculation(self):
        """Recipe retrieves correct dynamically summed nutrition values."""
        url = reverse('recipe-detail', kwargs={'pk': self.caprese.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Expected nutrition:
        # Tomato (100g): kcal=18.0, protein=0.9, carbs=3.9, fat=0.2, fiber=1.2
        # Mozzarella (50g): kcal=140.0, protein=11.0, carbs=1.0, fat=10.0, fiber=0.0
        # Basil (10g weight): kcal=2.3, protein=0.32, carbs=0.27, fat=0.06, fiber=0.16
        # Totals:
        # kcal = 18.0 + 140.0 + 2.3 = 160.3
        # protein = 0.9 + 11.0 + 0.32 = 12.22 (rounded to 12.2)
        # carbs = 3.9 + 1.0 + 0.27 = 5.17 (rounded to 5.2)
        # fat = 0.2 + 10.0 + 0.06 = 10.26 (rounded to 10.3)
        # fiber = 1.2 + 0.0 + 0.16 = 1.36 (rounded to 1.4)
        
        self.assertEqual(response.data['total_kcal'], 160.3)
        self.assertEqual(response.data['total_protein'], 12.2)
        self.assertEqual(response.data['total_carbs'], 5.2)
        self.assertEqual(response.data['total_fat'], 10.3)
        self.assertEqual(response.data['total_fiber'], 1.4)

    def test_create_recipe_nested_ingredients(self):
        """Creating a recipe with nested ingredients works via the API."""
        url = reverse('recipe-list')
        data = {
            "name": "Quick Tomato Snack",
            "prep_time": 2,
            "cook_time": 0,
            "servings": 1,
            "culinary_origin": "Italian",
            "meal_type": MealType.SNACK,
            "season": Season.SUMMER,
            "instructions": ["Slice tomatoes", "Eat them"],
            "recipe_ingredients": [
                {
                    "ingredient_id": self.tomato.id,
                    "quantity": 200.0,
                    "unit": Unit.GRAMS
                }
            ]
        }
        
        response = self.client.post(url, data, format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify db entries
        recipe = Recipe.objects.get(name="Quick Tomato Snack")
        self.assertEqual(recipe.recipe_ingredients.count(), 1)
        
        # Verify dynamic nutrition is computed: Tomato (200g) = 18 * 2 = 36.0 kcal
        self.assertEqual(response.data['total_kcal'], 36.0)

    def test_update_recipe_nested_ingredients(self):
        """Updating a recipe replacement of ingredients works."""
        url = reverse('recipe-detail', kwargs={'pk': self.caprese.id})
        data = {
            "name": "Caprese Salad Special",
            "prep_time": 5,
            "cook_time": 0,
            "servings": 2,
            "culinary_origin": "Italian",
            "meal_type": MealType.SNACK,
            "season": Season.SUMMER,
            "instructions": ["Slice tomatoes", "Drizzle oil"],
            "recipe_ingredients": [
                {
                    "ingredient_id": self.tomato.id,
                    "quantity": 150.0,
                    "unit": Unit.GRAMS
                }
            ]
        }
        
        response = self.client.put(url, data, format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Reload caprese
        self.caprese.refresh_from_db()
        self.assertEqual(self.caprese.name, "Caprese Salad Special")
        # Should now have only 1 ingredient
        self.assertEqual(self.caprese.recipe_ingredients.count(), 1)
        self.assertEqual(self.caprese.recipe_ingredients.first().quantity, 150.0)

    def test_recipe_filtering_and_searching(self):
        """Verify API filtering and searching."""
        # Create another recipe to contrast
        curry = Recipe.objects.create(
            name="Chicken Tikka Masala",
            description="Rich and creamy Indian curry",
            prep_time=20,
            cook_time=30,
            servings=4,
            culinary_origin="Indian",
            meal_type=MealType.DINNER,
            season=Season.WINTER,
            instructions=["Marinate chicken", "Simmer in sauce"]
        )
        RecipeIngredient.objects.create(
            recipe=curry,
            ingredient=self.tomato,
            quantity=150.0,
            unit=Unit.GRAMS
        )

        url = reverse('recipe-list')

        # 1. Search by name/desc
        response = self.client.get(f"{url}?search=curry")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Chicken Tikka Masala")

        # 2. Filter by meal type
        response = self.client.get(f"{url}?meal_type=Dinner")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Chicken Tikka Masala")

        # 3. Filter by season
        response = self.client.get(f"{url}?season=Summer")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Caprese Salad")

        # 4. Filter by origin
        response = self.client.get(f"{url}?origin=Italian")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Caprese Salad")

        # 5. Filter by ingredient name (both recipes use Tomato)
        response = self.client.get(f"{url}?ingredient=Tomato")
        self.assertEqual(len(response.data), 2)

        # 6. Filter by ingredient Mozzarella (only Caprese uses it)
        response = self.client.get(f"{url}?ingredient=Mozzarella")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Caprese Salad")
