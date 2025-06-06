from django.core.management.base import BaseCommand
from django.conf import settings
from inventory.models import Product, ProductImage
import os
from datetime import datetime

class Command(BaseCommand):
    help = 'Import des images de produits depuis le dossier media/products'

    def handle(self, *args, **options):
        # Utiliser le dossier media/products directement
        products_media_path = os.path.join(settings.MEDIA_ROOT, 'products')
        
        self.stdout.write(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
        self.stdout.write(f"Dossier des produits: {products_media_path}")

        # Structure des produits et leurs couleurs
        product_folders = [
            ('SDL HOM YZ625', ['TABAC', 'NOIR', 'MARRON']),
            ('SDL FEM YZ930', ['noir', 'marron', 'blanc', 'beige']),
            ('SDL FEM YZ498', ['ROSE', 'NOIR', 'CAMEL', 'BLEU CIEL', 'BEIGE']),
            ('ESCA FEM YZ1114', ['Rouge', 'Noir', 'Marron', 'Grenat', 'blanc', 'beige']),
            ('ESCA FEM YZ1121', ['Rouge', 'noir', 'marron foncé', 'marron', 'beige']),
            ('CHAUSS FEM YZ1362', ['Saumon', 'Rouge', 'Marron', 'huil', 'Beige']),
            ('CHAUSS FEM YZ1363', ['noir', 'beige'])
        ]

        # Traiter chaque produit
        for product_folder, colors in product_folders:
            product_ref = product_folder.split()[-1]  # Ex: YZ625
            try:
                product = Product.objects.get(reference=product_ref)
                self.stdout.write(f'\nTraitement du produit: {product_ref} ({product.name})')

                # Chemin du dossier du produit
                product_path = os.path.join(products_media_path, product_folder)
                if not os.path.exists(product_path):
                    self.stdout.write(self.style.WARNING(f'Dossier produit non trouvé: {product_path}'))
                    continue

                # Traiter chaque couleur
                for color in colors:
                    color_path = os.path.join(product_path, color)
                    self.stdout.write(f'  Vérification du dossier couleur: {color_path}')
                    
                    if os.path.exists(color_path):
                        self.stdout.write(f'  Dossier trouvé pour {color}')
                        # Traiter les images
                        for img_file in os.listdir(color_path):
                            if img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                                # Créer le chemin relatif pour la base de données
                                relative_path = os.path.join('products', product_folder, color, img_file).replace('\\', '/')
                                
                                self.stdout.write(f'    Traitement de l\'image: {img_file}')
                                self.stdout.write(f'    -> Chemin relatif: {relative_path}')

                                # Vérifier si l'image existe déjà dans la base de données
                                existing_image = ProductImage.objects.filter(image=relative_path).first()
                                if existing_image:
                                    self.stdout.write(f'    Image déjà existante dans la BD: {relative_path}')
                                    continue

                                # Créer l'entrée dans la base de données
                                try:
                                    image = ProductImage.objects.create(
                                        product=product,
                                        image=relative_path,
                                        alt_text=f"{product.name} - {color}",
                                        is_main=img_file.startswith('1'),
                                        order=0 if img_file.startswith('1') else 1
                                    )
                                    self.stdout.write(self.style.SUCCESS(f'    Image ajoutée avec succès: {relative_path}'))
                                except Exception as e:
                                    self.stdout.write(self.style.ERROR(f'    Erreur lors de la création de l\'image: {str(e)}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'  Dossier non trouvé pour la couleur {color}: {color_path}'))

            except Product.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Produit non trouvé: {product_ref}'))
                continue

        self.stdout.write(self.style.SUCCESS('\nImport des images terminé avec succès')) 