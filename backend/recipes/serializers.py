from rest_framework import serializers
from .models import Ingredient, Recipe, RecipeIngredient, Season, MealType, Unit

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'kcal', 'protein', 'carbs', 'fat', 'fiber', 'season',
            'created_at', 'updated_at'
        ]

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        source='ingredient',
        write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity', 'unit', 'weight_in_grams']
        # weight_in_grams is optional; auto-populates on save for g/ml if not provided
        extra_kwargs = {
            'weight_in_grams': {'required': False}
        }

class RecipeSerializer(serializers.ModelSerializer):
    recipe_ingredients = RecipeIngredientSerializer(many=True, required=False)
    
    # Read-only dynamic nutritional fields
    total_kcal = serializers.SerializerMethodField()
    total_protein = serializers.SerializerMethodField()
    total_carbs = serializers.SerializerMethodField()
    total_fat = serializers.SerializerMethodField()
    total_fiber = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'description', 'prep_time', 'cook_time', 'servings',
            'culinary_origin', 'meal_type', 'season', 'instructions',
            'recipe_ingredients', 'total_kcal', 'total_protein',
            'total_carbs', 'total_fat', 'total_fiber', 'created_at', 'updated_at'
        ]

    def get_total_kcal(self, obj):
        total = 0
        for ri in obj.recipe_ingredients.all():
            total += (ri.ingredient.kcal * ri.weight_in_grams) / 100
        return round(float(total), 1)

    def get_total_protein(self, obj):
        total = 0
        for ri in obj.recipe_ingredients.all():
            total += (ri.ingredient.protein * ri.weight_in_grams) / 100
        return round(float(total), 1)

    def get_total_carbs(self, obj):
        total = 0
        for ri in obj.recipe_ingredients.all():
            total += (ri.ingredient.carbs * ri.weight_in_grams) / 100
        return round(float(total), 1)

    def get_total_fat(self, obj):
        total = 0
        for ri in obj.recipe_ingredients.all():
            total += (ri.ingredient.fat * ri.weight_in_grams) / 100
        return round(float(total), 1)

    def get_total_fiber(self, obj):
        total = 0
        for ri in obj.recipe_ingredients.all():
            total += (ri.ingredient.fiber * ri.weight_in_grams) / 100
        return round(float(total), 1)

    def create(self, validated_data):
        ingredients_data = validated_data.pop('recipe_ingredients', [])
        recipe = Recipe.objects.create(**validated_data)
        for ri_data in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **ri_data)
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('recipe_ingredients', None)
        
        # Update main recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # If ingredients list was provided, overwrite the relation
        if ingredients_data is not None:
            instance.recipe_ingredients.all().delete()
            for ri_data in ingredients_data:
                RecipeIngredient.objects.create(recipe=instance, **ri_data)
                
        return instance
