from django.core.management.base import BaseCommand
from django.db import transaction
from decimal import Decimal
from django.utils.text import slugify
from inventory.models import Category, Product, ProductImage, Stock


class Command(BaseCommand):
    help = 'Peuple la base de données inventory avec des données de test basées sur le frontend'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Supprime toutes les données existantes avant de peupler',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        """Point d'entrée principal de la commande"""
        self.stdout.write(self.style.SUCCESS("🚀 Début du peuplement de la base de données inventory"))
        self.stdout.write("=" * 60)

        if options['clear']:
            self.clear_existing_data()
        
        categories = self.create_categories()
        self.create_products_and_stock(categories)
        
        self.stdout.write("=" * 60)
        self.stdout.write(self.style.SUCCESS("🎉 Peuplement terminé avec succès!"))
        self.stdout.write(f"📊 Résumé:")
        self.stdout.write(f"   - Catégories: {Category.objects.count()}")
        self.stdout.write(f"   - Produits: {Product.objects.count()}")
        self.stdout.write(f"   - Images: {ProductImage.objects.count()}")
        self.stdout.write(f"   - Stocks: {Stock.objects.count()}")

    def clear_existing_data(self):
        """Supprime toutes les données existantes"""
        self.stdout.write("🗑️ Suppression des données existantes...")
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Stock.objects.all().delete()
        Category.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("✅ Données existantes supprimées"))

    def create_categories(self):
        """Crée les catégories de produits"""
        self.stdout.write("📁 Création des catégories...")
        
        categories_data = [
            {'name': 'Sandales Homme', 'type': 'sandales'},
            {'name': 'Sandales Femme', 'type': 'sandales'},
            {'name': 'Sabots Homme', 'type': 'sabots'},
            {'name': 'Sabots Femme', 'type': 'sabots'},
            {'name': 'Mules Homme', 'type': 'mules'},
            {'name': 'Mules Femme', 'type': 'mules'},
            {'name': 'Chaussures Homme', 'type': 'sandales'}, # Type 'chaussure' n'existe pas dans les choix
            {'name': 'Espadrilles Homme', 'type': 'espadrilles'},
        ]
        
        created_categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'type': cat_data['type']}
            )
            created_categories[cat_data['name']] = category
            if created:
                self.stdout.write(f"  ✅ Catégorie créée: {category.name}")
            else:
                self.stdout.write(f"  ↩️ Catégorie existante: {category.name}")
        
        return created_categories

    def create_products_and_stock(self, categories):
        """Crée les produits et leur stock basés sur les données du frontend"""
        self.stdout.write("📦 Création des produits et du stock...")
        
        products_data = [
            {
                'name': 'Sandales Cuir Élégantes', 'reference': 'SAN-H-001', 'category_key': 'Sandales Homme', 'gender': 'homme', 'price': '189.90',
                'description': "Sandales en cuir véritable pour homme, idéales pour l'été.", 'available_sizes': '40,41,42,43,44,45', 'colors': 'Marron', 'material': 'Cuir',
                'is_featured': True, 'stock_quantity': 15, 'image_url': 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Sandales Bohème', 'reference': 'SAN-F-001', 'category_key': 'Sandales Femme', 'gender': 'femme', 'price': '127.92', 'old_price': '159.90',
                'description': 'Sandales bohèmes légères avec détails tressés.', 'available_sizes': '36,37,38,39,40', 'colors': 'Beige', 'material': 'Cuir tressé',
                'is_featured': True, 'stock_quantity': 20, 'image_url': 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Sandales Outdoor', 'reference': 'SAN-H-002', 'category_key': 'Sandales Homme', 'gender': 'homme', 'price': '219.90',
                'description': 'Sandales robustes pour la randonnée.', 'available_sizes': '41,42,43,44,45', 'colors': 'Noir', 'material': 'Nylon',
                'stock_quantity': 8, 'image_url': 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Sandales à Lanières', 'reference': 'SAN-F-002', 'category_key': 'Sandales Femme', 'gender': 'femme', 'price': '169.90',
                'description': "Élégantes sandales à lanières croisées.", 'available_sizes': '36,37,38,39', 'colors': 'Camel', 'material': 'Cuir',
                'is_featured': True, 'stock_quantity': 12, 'image_url': 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Sabots Traditionnels', 'reference': 'SAB-H-001', 'category_key': 'Sabots Homme', 'gender': 'homme', 'price': '149.90',
                'description': 'Sabots traditionnels en bois et cuir.', 'available_sizes': '41,42,43,44', 'colors': 'Brun foncé', 'material': 'Bois et cuir',
                'stock_quantity': 10, 'image_url': 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Sabots Modernes', 'reference': 'SAB-F-001', 'category_key': 'Sabots Femme', 'gender': 'femme', 'price': '152.92', 'old_price': '179.90',
                'description': 'Sabots contemporains avec semelle anatomique.', 'available_sizes': '36,37,38,39,40', 'colors': 'Beige', 'material': 'Cuir souple',
                'stock_quantity': 18, 'image_url': 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Mules Casual', 'reference': 'MUL-H-001', 'category_key': 'Mules Homme', 'gender': 'homme', 'price': '139.90',
                'description': 'Mules décontractées en cuir souple.', 'available_sizes': '40,41,42,43,44', 'colors': 'Marron', 'material': 'Cuir souple',
                'stock_quantity': 25, 'image_url': 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Mules Élégantes', 'reference': 'MUL-F-001', 'category_key': 'Mules Femme', 'gender': 'femme', 'price': '189.90',
                'description': 'Mules raffinées en cuir premium.', 'available_sizes': '36,37,38,39,40', 'colors': 'Noir', 'material': 'Cuir premium',
                'is_featured': True, 'stock_quantity': 15, 'image_url': 'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Chaussures Derby Classic', 'reference': 'CHU-H-001', 'category_key': 'Chaussures Homme', 'gender': 'homme', 'price': '249.90',
                'description': 'Chaussures Derby en cuir véritable.', 'available_sizes': '40,41,42,43,44,45', 'colors': 'Noir', 'material': 'Cuir véritable',
                'is_featured': True, 'stock_quantity': 18, 'image_url': 'https://images.pexels.com/photos/1334607/pexels-photo-1334607.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Chaussures Oxford Premium', 'reference': 'CHU-H-002', 'category_key': 'Chaussures Homme', 'gender': 'homme', 'price': '289.90',
                'description': 'Chaussures Oxford haut de gamme en cuir italien.', 'available_sizes': '41,42,43,44,45', 'colors': 'Brun', 'material': 'Cuir italien',
                'stock_quantity': 12, 'image_url': 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Espadrilles Méditerranéennes', 'reference': 'ESP-H-001', 'category_key': 'Espadrilles Homme', 'gender': 'homme', 'price': '119.90',
                'description': 'Espadrilles authentiques avec semelle en jute.', 'available_sizes': '40,41,42,43,44', 'colors': 'Bleu marine', 'material': 'Toile et jute',
                'stock_quantity': 22, 'image_url': 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                'name': 'Espadrilles Casual Chic', 'reference': 'ESP-H-002', 'category_key': 'Espadrilles Homme', 'gender': 'homme', 'price': '139.90',
                'description': 'Espadrilles modernes avec finitions en cuir.', 'available_sizes': '41,42,43,44', 'colors': 'Beige', 'material': 'Cuir et toile',
                'is_featured': True, 'stock_quantity': 15, 'image_url': 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
        ]
        
        for product_data in products_data:
            try:
                if Product.objects.filter(reference=product_data['reference']).exists():
                    self.stdout.write(f"  ↩️ Produit existant: {product_data['name']}")
                    continue
                
                stock = Stock.objects.create(
                    article_code=product_data['reference'],
                    article_name=product_data['name'],
                    color=product_data['colors'],
                    quantity_available=product_data['stock_quantity'],
                    photo_url=product_data.get('image_url')
                )
                
                product = Product.objects.create(
                    name=product_data['name'],
                    reference=product_data['reference'],
                    category=categories[product_data['category_key']],
                    gender=product_data['gender'],
                    price=Decimal(product_data['price']),
                    old_price=Decimal(product_data.get('old_price')) if product_data.get('old_price') else None,
                    description=product_data['description'],
                    available_sizes=product_data['available_sizes'],
                    colors=product_data['colors'],
                    material=product_data['material'],
                    is_featured=product_data.get('is_featured', False),
                    stock=stock,
                    slug=slugify(product_data['name']),
                )
                
                ProductImage.objects.create(
                    product=product,
                    image_url=product_data.get('image_url'),
                    alt_text=f"Image de {product.name}",
                    is_main=True,
                    order=1
                )
                
                self.stdout.write(f"  ✅ Produit créé: {product.name}")
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  ❌ Erreur lors de la création du produit {product_data['name']}: {e}")) 