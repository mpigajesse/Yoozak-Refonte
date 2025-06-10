from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Order, ArticleCommande
from client.models import Client
from inventory.models import Product


class ArticleCommandeSerializer(serializers.ModelSerializer):
    """Serializer pour les articles de commande"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    total_price = serializers.SerializerMethodField()
    
    # Permettre les valeurs vides pour size et couleurs
    size = serializers.CharField(required=False, allow_blank=True)
    color_ar = serializers.CharField(required=False, allow_blank=True)
    color_fr = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = ArticleCommande
        fields = [
            'id', 'product', 'product_name', 'product_image', 'product_code',
            'size', 'color_ar', 'color_fr', 'quantity', 'price', 'total_price'
        ]
        
    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une commande"""
    articles = ArticleCommandeSerializer(many=True, write_only=True)
    client_data = serializers.DictField(write_only=True, required=False)
    region = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Order
        fields = [
            'client_name', 'phone', 'address', 'city', 'region',
            'articles', 'client_data', 'source', 'notes'
        ]
        
    def create(self, validated_data):
        articles_data = validated_data.pop('articles', [])
        client_data = validated_data.pop('client_data', None)
        
        # Générer le numéro de commande au format YZ-CMD-XXX
        last_order = Order.objects.order_by('-yoozak_id').first()
        if last_order:
            next_number = last_order.yoozak_id + 1
        else:
            next_number = 1
        order_number = f"YZ-CMD-{str(next_number).zfill(4)}"
        
        # Créer ou récupérer le client
        client = None
        if client_data:
            # Client connecté
            user = self.context['request'].user if self.context['request'].user.is_authenticated else None
            if user:
                client, created = Client.objects.get_or_create(
                    user=user,
                    defaults={
                        'first_name': client_data.get('firstName', ''),
                        'last_name': client_data.get('lastName', ''),
                        'email': client_data.get('email', ''),
                        'phone': client_data.get('phone', ''),
                        'address': client_data.get('address', ''),
                        'city': client_data.get('city', ''),
                        'postal_code': client_data.get('postalCode', ''),
                        'country': client_data.get('country', 'Maroc'),
                        'is_guest': False
                    }
                )
            else:
                # Client invité
                client = Client.objects.create(
                    first_name=client_data.get('firstName', ''),
                    last_name=client_data.get('lastName', ''),
                    email=client_data.get('email', ''),
                    phone=client_data.get('phone', ''),
                    address=client_data.get('address', ''),
                    city=client_data.get('city', ''),
                    postal_code=client_data.get('postalCode', ''),
                    country=client_data.get('country', 'Maroc'),
                    is_guest=True
                )
        
        # Calculer le prix total d'abord
        total_price = 0
        for article_data in articles_data:
            quantity = article_data.get('quantity', 1)
            price = article_data.get('price', 0)
            if 'product' in article_data:
                product_id = article_data.get('product')
                # S'assurer que product_id est bien un entier
                if isinstance(product_id, int) or (isinstance(product_id, str) and product_id.isdigit()):
                    try:
                        product = Product.objects.get(id=int(product_id))
                        price = float(product.price) if not price else float(price)
                    except Product.DoesNotExist:
                        pass
            total_price += quantity * float(price)
        
        # Créer la commande avec le prix calculé
        # Retirer source des validated_data s'il existe pour éviter le conflit
        validated_data.pop('source', None)
        
        # Importer timezone pour la date de création
        from django.utils import timezone
        
        order = Order.objects.create(
            order_number=order_number,
            client=client,
            source='website',
            creation_date=timezone.now(),
            price=total_price,
            **validated_data
        )
        
        # Créer les articles de la commande
        for article_data in articles_data:
            product_data = article_data.get('product')
            product = None
            
            if product_data:
                # Cas 1: Si c'est déjà un objet Product (depuis le frontend)
                if isinstance(product_data, Product):
                    product = product_data
                
                # Cas 2: Si c'est un ID (entier ou string)
                elif isinstance(product_data, int) or (isinstance(product_data, str) and product_data.isdigit()):
                    try:
                        product = Product.objects.get(id=int(product_data))
                    except Product.DoesNotExist:
                        pass
            
            # Créer l'article avec le product_code approprié
            article = ArticleCommande(
                order=order,
                product=product,
                size=article_data.get('size', ''),
                color_ar=article_data.get('color_ar', ''),
                color_fr=article_data.get('color_fr', ''),
                quantity=article_data.get('quantity', 1),
                price=article_data.get('price', float(product.price) if product else 0)
            )
            
            # Définir manuellement le product_code avant de sauvegarder
            if product:
                article.product_code = product.reference
            
            article.save()
        
        return order


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails d'une commande"""
    articles = ArticleCommandeSerializer(many=True, read_only=True)
    client_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    delivery_status_display = serializers.CharField(source='get_delivery_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'yoozak_id', 'order_number', 'client_name', 'phone', 'address', 'city', 'region',
            'price', 'creation_date', 'order_date', 'confirmation_date',
            'status', 'status_display', 'payment_status', 'payment_status_display',
            'delivery_status', 'delivery_status_display', 'motifs', 'notes',
            'articles', 'client_info', 'source'
        ]
        
    def get_client_info(self, obj):
        if obj.client:
            return {
                'id': obj.client.id,
                'full_name': obj.client.display_name,
                'email': obj.client.display_email,
                'is_guest': obj.client.is_guest
            }
        return None 