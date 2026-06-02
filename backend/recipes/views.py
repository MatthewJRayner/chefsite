from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Ingredient, Recipe
from .serializers import IngredientSerializer, RecipeSerializer

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
            
        # Filter by season
        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__iexact=season)
            
        return queryset

class RecipeViewSet(viewsets.ModelViewSet):
    # Prefetch recipe ingredients and their ingredients to optimize queries (avoid N+1)
    queryset = Recipe.objects.all().prefetch_related('recipe_ingredients__ingredient')
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by meal type
        meal_type = self.request.query_params.get('meal_type')
        if meal_type:
            queryset = queryset.filter(meal_type__iexact=meal_type)
            
        # Filter by season
        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__iexact=season)
            
        # Filter by culinary origin
        origin = self.request.query_params.get('origin')
        if origin:
            queryset = queryset.filter(culinary_origin__iexact=origin)
            
        # Filter by ingredient (name or ID)
        ingredient = self.request.query_params.get('ingredient')
        if ingredient:
            if ingredient.isdigit():
                queryset = queryset.filter(ingredients__id=ingredient)
            else:
                queryset = queryset.filter(ingredients__name__icontains=ingredient)
                
        # Search by recipe name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
            
        # Sorting (default to newest recipes first)
        ordering = self.request.query_params.get('ordering', '-created_at')
        if ordering not in ['created_at', '-created_at', 'name', '-name', 'prep_time', '-prep_time', 'cook_time', '-cook_time']:
            ordering = '-created_at'
            
        queryset = queryset.order_by(ordering)
        
        # Return distinct items because filtering on M2M relations can duplicate rows
        return queryset.distinct()
