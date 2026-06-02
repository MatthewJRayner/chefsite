from django.db import models

class Season(models.TextChoices):
    SPRING = 'Spring', 'Spring'
    SUMMER = 'Summer', 'Summer'
    AUTUMN = 'Autumn', 'Autumn'
    WINTER = 'Winter', 'Winter'
    ALL_YEAR = 'All Year', 'All Year'

class MealType(models.TextChoices):
    BREAKFAST = 'Breakfast', 'Breakfast'
    LUNCH = 'Lunch', 'Lunch'
    DINNER = 'Dinner', 'Dinner'
    DESSERT = 'Dessert', 'DESSERT'
    SNACK = 'Snack', 'Snack'
    OTHER = 'Other', 'Other'

class Unit(models.TextChoices):
    GRAMS = 'g', 'grams (g)'
    MILLILITERS = 'ml', 'milliliters (ml)'
    PIECES = 'pcs', 'pieces (pcs)'
    TABLESPOON = 'tbsp', 'tablespoons (tbsp)'
    TEASPOON = 'tsp', 'teaspoons (tsp)'

class Ingredient(models.Model):
    name = models.CharField(max_length=200, unique=True)
    kcal = models.IntegerField(help_text="kCal per 100g")
    protein = models.DecimalField(max_digits=6, decimal_places=2, help_text="Protein (g) per 100g")
    carbs = models.DecimalField(max_digits=6, decimal_places=2, help_text="Carbohydrates (g) per 100g")
    fat = models.DecimalField(max_digits=6, decimal_places=2, help_text="Fat (g) per 100g")
    fiber = models.DecimalField(max_digits=6, decimal_places=2, help_text="Fiber (g) per 100g")
    season = models.CharField(
        max_length=20,
        choices=Season.choices,
        default=Season.ALL_YEAR,
        help_text="Best seasonality for this ingredient"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, default='')
    prep_time = models.IntegerField(help_text="Preparation time in minutes", default=0)
    cook_time = models.IntegerField(help_text="Cooking time in minutes", default=0)
    servings = models.IntegerField(default=1)
    culinary_origin = models.CharField(max_length=100, help_text="E.g., Italian, Japanese, French")
    meal_type = models.CharField(
        max_length=20,
        choices=MealType.choices,
        default=MealType.DINNER
    )
    season = models.CharField(
        max_length=20,
        choices=Season.choices,
        default=Season.ALL_YEAR,
        help_text="Best seasonality for this recipe"
    )
    instructions = models.JSONField(
        default=list,
        help_text="A list of step-by-step instructions (e.g., ['Step 1...', 'Step 2...'])"
    )
    ingredients = models.ManyToManyField(
        Ingredient,
        through='RecipeIngredient',
        related_name='recipes'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='recipe_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='recipe_ingredients')
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(
        max_length=10,
        choices=Unit.choices,
        default=Unit.GRAMS
    )
    weight_in_grams = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Equivalent weight in grams for nutritional calculations. Auto-populates for 'g' and 'ml'."
    )

    def save(self, *args, **kwargs):
        # Auto-calculate weight_in_grams if not specified and the unit is 'g' or 'ml'
        if self.unit in [Unit.GRAMS, Unit.MILLILITERS] and (self.weight_in_grams is None or self.weight_in_grams == 0):
            self.weight_in_grams = self.quantity
        elif self.weight_in_grams is None:
            self.weight_in_grams = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} {self.get_unit_display()} of {self.ingredient.name} in {self.recipe.name}"
