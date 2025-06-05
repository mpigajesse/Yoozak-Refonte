from django.core.management.base import BaseCommand
from orders.models import Region, Ville
import csv
import os

class Command(BaseCommand):
    help = 'Importe les régions et villes depuis un fichier CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Chemin vers le fichier CSV')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'Le fichier {csv_file} n\'existe pas'))
            return
        
        # Dictionnaire pour stocker les régions déjà créées
        regions = {}
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                region_name = row.get('Region', '').strip()
                ville_name = row.get('Ville', '').strip()
                delai = row.get('Delai', '').strip()
                tarif = row.get('Tarif', '').strip()
                
                # Ignorer les lignes vides ou sans ville
                if not region_name or not ville_name:
                    continue
                
                # Nettoyer le tarif (enlever 'DHs' et convertir en nombre)
                try:
                    tarif = float(tarif.replace('DHs', '').strip()) if tarif else None
                except (ValueError, AttributeError):
                    tarif = None
                
                # Créer ou récupérer la région
                if region_name not in regions:
                    region, created = Region.objects.get_or_create(name=region_name)
                    regions[region_name] = region
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Région créée : {region_name}'))
                else:
                    region = regions[region_name]
                
                # Créer la ville
                try:
                    ville, created = Ville.objects.get_or_create(
                        name=ville_name,
                        region=region,
                        defaults={
                            'delivery_delay': delai,
                            'delivery_fee': tarif
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(
                            f'Ville créée : {ville_name} ({region_name}) - Délai: {delai}, Tarif: {tarif}'
                        ))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f'Erreur lors de la création de la ville {ville_name} : {str(e)}'
                    ))
        
        self.stdout.write(self.style.SUCCESS('Import terminé avec succès')) 