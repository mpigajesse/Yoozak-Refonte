from rest_framework import viewsets, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from inventory.models import Product, Category, ProductImage
from .serializers import (
    ProductListSerializer, 
    ProductDetailSerializer,
    CategorySerializer,
    ProductImageSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint pour les catégories de produits.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'type']

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Récupérer tous les produits d'une catégorie"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint pour les produits.
    """
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'gender', 'is_featured']
    search_fields = ['name', 'reference', 'description']
    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupérer les produits mis en avant"""
        featured = Product.objects.filter(is_featured=True, is_active=True)
        serializer = ProductListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_gender(self, request):
        """Récupérer les produits par genre"""
        gender = request.query_params.get('gender', 'unisexe')
        products = Product.objects.filter(gender=gender, is_active=True)
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def similar(self, request, slug=None):
        """Récupérer les produits similaires"""
        product = self.get_object()
        similar = Product.objects.filter(
            category=product.category,
            gender=product.gender,
            is_active=True
        ).exclude(id=product.id)[:4]
        serializer = ProductListSerializer(similar, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def images(self, request, slug=None):
        """Récupérer toutes les images d'un produit"""
        product = self.get_object()
        images = product.images.all().order_by('order')
        serializer = ProductImageSerializer(images, many=True, context={'request': request})
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def nested_categories_list(request):
    """
    Retourne une liste des catégories groupées par type, 
    idéal pour les menus du frontend.
    """
    # Récupérer les types de catégories directement depuis le modèle
    category_types = Category.CATEGORY_CHOICES
    result = []
    
    # Itérer sur chaque type de catégorie (ex: 'sandales', 'mules')
    for type_value, type_display in category_types:
        # Filtrer toutes les catégories qui appartiennent à ce type ET qui sont actives
        subcategories = Category.objects.filter(type=type_value, is_active=True)
        
        # N'ajouter le groupe que s'il contient au moins une sous-catégorie
        if subcategories.exists():
            serializer = CategorySerializer(subcategories, many=True)
            result.append({
                'type_name': type_display,      # ex: "Sandales"
                'type_slug': type_value,        # ex: "sandales"
                'subcategories': serializer.data # La liste des sous-catégories
            })
            
    return Response(result) 