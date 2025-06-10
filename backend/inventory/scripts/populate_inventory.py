#!/usr/bin/env python
"""
Script pour peupler la base de données de l'application inventory
avec des données logiques basées sur les données simulées du frontend.

Usage:
    python manage.py shell
    >>> exec(open('inventory/scripts/populate_inventory.py').read())
"""

import os
import sys
import django
from decimal import Decimal
from django.utils.text import slugify

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'order_management.settings')
django.setup()

from inventory.models import Category, Product, ProductImage, Stock


def clear_existing_data():
    """Supprime toutes les données existantes"""
    print("🗑️ Suppression des données existantes...")
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    Stock.objects.all().delete()
    Category.objects.all().delete()
    print("✅ Données existantes supprimées")


def create_categories():
    """Crée les catégories de produits"""
    print("📁 Création des catégories...")
    
    categories_data = [
        {
            'name': 'Sandales Homme',
            'type': 'sandales',
            'description': 'Sandales confortables et élégantes pour homme, parfaites pour l\'été'
        },
        {
            'name': 'Sandales Femme',
            'type': 'sandales',
            'description': 'Sandales élégantes et confortables pour femme, idéales pour toutes occasions'
        },
        {
            'name': 'Sabots Homme',
            'type': 'sabots',
            'description': 'Sabots traditionnels et modernes pour homme, alliant confort et style'
        },
        {
            'name': 'Sabots Femme',
            'type': 'sabots',
            'description': 'Sabots féminins alliant praticité et élégance'
        },
        {
            'name': 'Mules Homme',
            'type': 'mules',
            'description': 'Mules décontractées pour homme, parfaites pour la maison et les sorties'
        },
        {
            'name': 'Mules Femme',
            'type': 'mules',
            'description': 'Mules raffinées pour femme, idéales pour le travail et le quotidien'
        },
        {
            'name': 'Chaussures Homme',
            'type': 'sandales',  # Pas de type 'chaussures' dans les choices
            'description': 'Chaussures classiques et modernes pour homme'
        },
        {
            'name': 'Espadrilles Homme',
            'type': 'espadrilles',
            'description': 'Espadrilles authentiques et modernes pour homme'
        }
    ]
    
    created_categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'type': cat_data['type'],
                'description': cat_data['description'],
                'slug': slugify(cat_data['name'])
            }
        )
        created_categories[cat_data['name']] = category
        if created:
            print(f"  ✅ Catégorie créée: {category.name}")
        else:
            print(f"  ↩️ Catégorie existante: {category.name}")
    
    return created_categories


def create_products_and_stock(categories):
    """Crée les produits et leur stock basés sur les données du frontend"""
    print("📦 Création des produits et du stock...")
    
    # Données des produits basées sur mockData.ts du frontend
    products_data = [
        {
            'name': 'Sandales Cuir Élégantes',
            'reference': 'SAN-H-001',
            'category_key': 'Sandales Homme',
            'gender': 'homme',
            'price': Decimal('189.90'),
            'old_price': None,
            'description': 'Sandales en cuir véritable pour homme, idéales pour l\'été avec une semelle confortable et durable.',
            'available_sizes': '40,41,42,43,44,45',
            'colors': 'Marron',
            'material': 'Cuir véritable',
            'is_featured': True,
            'stock_quantity': 15,
            'image_url': 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sandales Bohème',
            'reference': 'SAN-F-001',
            'category_key': 'Sandales Femme',
            'gender': 'femme',
            'price': Decimal('127.92'),  # 159.90 - 20%
            'old_price': Decimal('159.90'),
            'description': 'Sandales bohèmes légères et confortables avec détails tressés et finitions artisanales.',
            'available_sizes': '36,37,38,39,40',
            'colors': 'Beige',
            'material': 'Cuir tressé',
            'is_featured': True,
            'stock_quantity': 20,
            'image_url': 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sandales Outdoor',
            'reference': 'SAN-H-002',
            'category_key': 'Sandales Homme',
            'gender': 'homme',
            'price': Decimal('219.90'),
            'description': 'Sandales outdoor robustes, parfaites pour la randonnée et les activités en plein air.',
            'available_sizes': '41,42,43,44,45',
            'colors': 'Noir',
            'material': 'Cuir et nylon renforcé',
            'stock_quantity': 8,
            'image_url': 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sandales à Lanières',
            'reference': 'SAN-F-002',
            'category_key': 'Sandales Femme',
            'gender': 'femme',
            'price': Decimal('169.90'),
            'description': 'Élégantes sandales à lanières croisées, parfaites pour les soirées d\'été.',
            'available_sizes': '36,37,38,39',
            'colors': 'Camel',
            'material': 'Cuir nubuck',
            'is_featured': True,
            'stock_quantity': 12,
            'image_url': 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sabots Traditionnels',
            'reference': 'SAB-H-001',
            'category_key': 'Sabots Homme',
            'gender': 'homme',
            'price': Decimal('149.90'),
            'description': 'Sabots traditionnels en bois et cuir, fabriqués selon les méthodes ancestrales.',
            'available_sizes': '41,42,43,44',
            'colors': 'Brun foncé',
            'material': 'Bois et cuir',
            'stock_quantity': 10,
            'image_url': 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sabots Modernes',
            'reference': 'SAB-F-001',
            'category_key': 'Sabots Femme',
            'gender': 'femme',
            'price': Decimal('152.92'),  # 179.90 - 15%
            'old_price': Decimal('179.90'),
            'description': 'Sabots contemporains avec semelle anatomique et cuir souple pour un confort optimal.',
            'available_sizes': '36,37,38,39,40',
            'colors': 'Beige',
            'material': 'Cuir souple',
            'stock_quantity': 18,
            'image_url': 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sabots de Chef',
            'reference': 'SAB-H-002',
            'category_key': 'Sabots Homme',
            'gender': 'homme',
            'price': Decimal('159.90'),
            'description': 'Sabots professionnels adaptés aux métiers de la restauration et de la santé, antidérapants.',
            'available_sizes': '40,41,42,43,44,45',
            'colors': 'Noir',
            'material': 'Polymère antidérapant',
            'stock_quantity': 25,
            'image_url': 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Sabots Scandinaves',
            'reference': 'SAB-F-002',
            'category_key': 'Sabots Femme',
            'gender': 'femme',
            'price': Decimal('199.90'),
            'description': 'Sabots d\'inspiration scandinave, alliant style minimaliste et confort quotidien.',
            'available_sizes': '36,37,38,39,40,41',
            'colors': 'Naturel',
            'material': 'Bois de bouleau',
            'stock_quantity': 14,
            'image_url': 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Mules Casual',
            'reference': 'MUL-H-001',
            'category_key': 'Mules Homme',
            'gender': 'homme',
            'price': Decimal('139.90'),
            'description': 'Mules décontractées en cuir souple avec semelle en caoutchouc durable.',
            'available_sizes': '40,41,42,43,44',
            'colors': 'Marron',
            'material': 'Cuir souple',
            'stock_quantity': 25,
            'image_url': 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Mules Élégantes',
            'reference': 'MUL-F-001',
            'category_key': 'Mules Femme',
            'gender': 'femme',
            'price': Decimal('189.90'),
            'description': 'Mules raffinées en cuir premium avec talon bas, parfaites pour le bureau.',
            'available_sizes': '36,37,38,39,40',
            'colors': 'Noir',
            'material': 'Cuir premium',
            'is_featured': True,
            'stock_quantity': 15,
            'image_url': 'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Mules d\'Intérieur',
            'reference': 'MUL-H-002',
            'category_key': 'Mules Homme',
            'gender': 'homme',
            'price': Decimal('129.90'),
            'description': 'Mules confortables pour la maison avec doublure en laine naturelle.',
            'available_sizes': '41,42,43,44,45',
            'colors': 'Gris',
            'material': 'Laine et cuir',
            'stock_quantity': 30,
            'image_url': 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Mules d\'Été',
            'reference': 'MUL-F-002',
            'category_key': 'Mules Femme',
            'gender': 'femme',
            'price': Decimal('149.90'),
            'description': 'Mules légères et respirantes, idéales pour la saison estivale.',
            'available_sizes': '36,37,38,39,40,41',
            'colors': 'Blanc',
            'material': 'Cuir perforé',
            'stock_quantity': 22,
            'image_url': 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Chaussures Derby Classic',
            'reference': 'CHU-H-001',
            'category_key': 'Chaussures Homme',
            'gender': 'homme',
            'price': Decimal('249.90'),
            'description': 'Chaussures Derby en cuir véritable avec finition artisanale, parfaites pour les occasions formelles.',
            'available_sizes': '40,41,42,43,44,45',
            'colors': 'Noir',
            'material': 'Cuir véritable',
            'is_featured': True,
            'stock_quantity': 18,
            'image_url': 'https://images.pexels.com/photos/1334607/pexels-photo-1334607.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Chaussures Oxford Premium',
            'reference': 'CHU-H-002',
            'category_key': 'Chaussures Homme',
            'gender': 'homme',
            'price': Decimal('289.90'),
            'description': 'Chaussures Oxford haut de gamme en cuir italien avec semelle cousue Goodyear.',
            'available_sizes': '41,42,43,44,45',
            'colors': 'Brun',
            'material': 'Cuir italien',
            'stock_quantity': 12,
            'image_url': 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Espadrilles Méditerranéennes',
            'reference': 'ESP-H-001',
            'category_key': 'Espadrilles Homme',
            'gender': 'homme',
            'price': Decimal('119.90'),
            'description': 'Espadrilles authentiques avec semelle en jute naturel et toile de coton respirante.',
            'available_sizes': '40,41,42,43,44',
            'colors': 'Bleu marine',
            'material': 'Toile et jute',
            'stock_quantity': 22,
            'image_url': 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            'name': 'Espadrilles Casual Chic',
            'reference': 'ESP-H-002',
            'category_key': 'Espadrilles Homme',
            'gender': 'homme',
            'price': Decimal('139.90'),
            'description': 'Espadrilles modernes avec finitions en cuir et semelle renforcée pour un confort quotidien.',
            'available_sizes': '41,42,43,44',
            'colors': 'Beige',
            'material': 'Cuir et toile',
            'is_featured': True,
            'stock_quantity': 15,
            'image_url': 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
    ]
    
    for product_data in products_data:
        try:
            # Créer le stock d'abord
            stock = Stock.objects.create(
                article_code=product_data['reference'],
                article_name=product_data['name'],
                color=product_data['colors'],
                quantity_available=product_data['stock_quantity']
            )
            
            # Créer le produit
            product = Product.objects.create(
                name=product_data['name'],
                reference=product_data['reference'],
                category=categories[product_data['category_key']],
                gender=product_data['gender'],
                price=product_data['price'],
                old_price=product_data.get('old_price'),
                description=product_data['description'],
                available_sizes=product_data['available_sizes'],
                colors=product_data['colors'],
                material=product_data['material'],
                is_featured=product_data.get('is_featured', False),
                stock=stock,
                slug=slugify(product_data['name']),
                meta_title=product_data['name'],
                meta_description=product_data['description'][:160]
            )
            
            # Créer l'image principale du produit
            ProductImage.objects.create(
                product=product,
                image=product_data['image_url'],
                alt_text=f"Image de {product.name}",
                is_main=True,
                order=1
            )
            
            print(f"  ✅ Produit créé: {product.name} (Stock: {stock.quantity_available})")
            
        except Exception as e:
            print(f"  ❌ Erreur lors de la création du produit {product_data['name']}: {e}")


def main():
    """Fonction principale du script"""
    print("🚀 Début du peuplement de la base de données inventory")
    print("=" * 60)
    
    try:
        # Supprimer les données existantes
        clear_existing_data()
        
        # Créer les catégories
        categories = create_categories()
        
        # Créer les produits et le stock
        create_products_and_stock(categories)
        
        print("=" * 60)
        print("🎉 Peuplement terminé avec succès!")
        print(f"📊 Résumé:")
        print(f"   - Catégories créées: {Category.objects.count()}")
        print(f"   - Produits créés: {Product.objects.count()}")
        print(f"   - Images créées: {ProductImage.objects.count()}")
        print(f"   - Stocks créés: {Stock.objects.count()}")
        
    except Exception as e:
        print(f"❌ Erreur lors du peuplement: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()