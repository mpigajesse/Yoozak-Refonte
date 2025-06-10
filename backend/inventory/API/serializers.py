from rest_framework import serializers
from inventory.models import Product, Category, ProductImage, Stock

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'type']

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_main', 'order']
        
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and obj.image.url:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        elif obj.image_url:
            return obj.image_url
        return None

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'article_code', 'quantity_available', 'color', 'size']

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    stock_status = serializers.CharField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'reference', 
            'category', 'gender', 'price', 
            'old_price', 'main_image', 
            'is_active', 'is_featured',
            'stock_status'
        ]
        
    def get_main_image(self, obj):
        main_image = obj.main_image
        if main_image:
            request = self.context.get('request')
            return ProductImageSerializer(main_image, context={'request': request}).data
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    stock = StockSerializer(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    available_sizes = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'reference',
            'description', 'category', 'gender',
            'price', 'old_price', 'images',
            'available_sizes', 'colors', 'material',
            'is_active', 'is_featured', 'stock',
            'stock_status', 'meta_title', 'meta_description'
        ]

    def get_available_sizes(self, obj):
        if obj.available_sizes:
            return [size.strip() for size in obj.available_sizes.split(',')]
        return []

    def get_colors(self, obj):
        if obj.colors:
            return [color.strip() for color in obj.colors.split(',')]
        return [] 