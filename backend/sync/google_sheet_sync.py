import os
import gspread
from google.oauth2.service_account import Credentials
from django.conf import settings
from django.utils import timezone
from orders.models import Order, ArticleCommande
from sync.models import SyncLog, GoogleSheetConfig
from accounts.models import Operator

class GoogleSheetSync:
    """Classe pour gérer la synchronisation avec Google Sheets"""
    
    def __init__(self, sheet_config, triggered_by="admin"):
        self.sheet_config = sheet_config
        self.triggered_by = triggered_by
        self.records_imported = 0
        self.errors = []
        
    def authenticate(self):
        """Authentification avec l'API Google Sheets"""
        try:
            scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
            credentials = Credentials.from_service_account_file(
                settings.GOOGLE_CREDENTIALS_FILE, 
                scopes=scope
            )
            client = gspread.authorize(credentials)
            return client
        except Exception as e:
            self.errors.append(f"Erreur d'authentification: {str(e)}")
            return None
    
    def get_sheet(self, client):
        """Récupère la feuille Google Sheet"""
        try:
            # Ouvrir par URL ou par clé selon ce qui est fourni
            if 'docs.google.com' in self.sheet_config.sheet_url:
                spreadsheet = client.open_by_url(self.sheet_config.sheet_url)
            else:
                spreadsheet = client.open_by_key(self.sheet_config.sheet_url)
                
            # Sélectionner la feuille par nom
            worksheet = spreadsheet.worksheet(self.sheet_config.sheet_name)
            return worksheet
        except Exception as e:
            self.errors.append(f"Erreur d'accès à la feuille: {str(e)}")
            return None
    
    def parse_product(self, product_str):
        """Parse le format de produit et retourne les composants"""
        try:
            # Format attendu: "ESP HOM YZ650 - 42/أسود أبيض / noir blanc"
            parts = product_str.split(' - ')
            if len(parts) != 2:
                return None
            
            product_code = parts[0].strip()
            details = parts[1].split('/')
            if len(details) != 3:
                return None
            
            size = details[0].strip()
            color_ar = details[1].strip()
            color_fr = details[2].strip()
            
            return {
                'product_code': product_code,
                'size': size,
                'color_ar': color_ar,
                'color_fr': color_fr
            }
        except Exception as e:
            self.errors.append(f"Erreur de parsing du produit: {str(e)}")
            return None
    
    def process_row(self, row_data, headers):
        """Traite une ligne de données et crée une nouvelle commande uniquement si elle n'existe pas"""
        try:
            # Créer un dictionnaire avec les données de la ligne
            data = dict(zip(headers, row_data))
            
            # Vérifier si la commande existe déjà
            order_number = data.get('N° Commande')
            if not order_number:
                self.errors.append(f"Ligne sans numéro de commande: {data}")
                return False
            
            # Vérifier si la commande existe déjà
            if Order.objects.filter(order_number=order_number).exists():
                # La commande existe déjà, on l'ignore
                return True
            
            # Gérer le prix de manière sécurisée
            try:
                price = float(data.get('Prix', 0))
            except (ValueError, TypeError):
                price = 0.0
                
            # Créer une nouvelle commande
            order = Order.objects.create(
                order_number=order_number,
                status=self._map_status(data.get('Statut', 'Non affectée')),
                client_name=data.get('Client', ''),
                phone=data.get('Téléphone', ''),
                address=data.get('Adresse', ''),
                city=data.get('Ville', ''),
                product=data.get('Produit', ''),
                quantity=int(data.get('Quantité', 1)),
                price=price,
                creation_date=timezone.now(),
                modifications=data.get('Modification', ''),
                cancellation_reason=data.get('Motifs', '')
            )
            
            # Parser le produit et créer l'article de commande
            product_info = self.parse_product(data.get('Produit', ''))
            if product_info:
                ArticleCommande.objects.create(
                    order=order,
                    product_code=product_info['product_code'],
                    size=product_info['size'],
                    color_ar=product_info['color_ar'],
                    color_fr=product_info['color_fr'],
                    quantity=int(data.get('Quantité', 1)),
                    price=price
            )
            
            # Si un opérateur est spécifié et que la commande est affectée
            operator_name = data.get('Opérateur', '')
            if operator_name and order.status == 'affecte':
                try:
                    operator = Operator.objects.get(user__username=operator_name)
                    order.operator = operator
                    order.save()
                except Operator.DoesNotExist:
                    self.errors.append(f"Opérateur non trouvé: {operator_name}")
            
            self.records_imported += 1
            return True
            
        except Exception as e:
            self.errors.append(f"Erreur lors du traitement de la ligne: {str(e)}")
            return False
    
    def _map_status(self, status):
        """Mappe les statuts du fichier aux statuts de l'application"""
        status_map = {
            'Non affectée': 'non_affectee',
            'Affectée': 'affectee',
            'Erronée': 'erronnee',
            'Doublon': 'doublon',
            'À confirmer': 'a_confirmer',
            'En cours de confirmation': 'en_cours_confirmation',
            'Confirmée': 'confirmee',
            'Annulée': 'annulee',
            # Ajout des variantes possibles
            'Erronee': 'erronnee',
            'Errone': 'erronnee',
            'Erroné': 'erronnee',
            'Erronee': 'erronnee',
            'Doublons': 'doublon',
            'Non affectee': 'non_affectee',
            'Non affecté': 'non_affectee',
            'Affecte': 'affectee',
            'Affecté': 'affectee',
            'Confirmee': 'confirmee',
            'Confirmé': 'confirmee',
            'Annulee': 'annulee',
            'Annulé': 'annulee'
        }
        # Nettoyer le statut reçu (enlever les espaces, mettre en minuscules)
        cleaned_status = status.strip().lower() if status else ''
        # Chercher dans le dictionnaire en ignorant la casse
        for key, value in status_map.items():
            if key.lower() == cleaned_status:
                return value
        # Si aucun statut ne correspond, retourner non_affectee
        return 'non_affectee'
    
    def sync(self):
        """Synchronise les données depuis Google Sheets"""
        client = self.authenticate()
        if not client:
            self._log_sync('error')
            return False
            
        worksheet = self.get_sheet(client)
        if not worksheet:
            self._log_sync('error')
            return False
            
        try:
            # Récupérer toutes les données
            all_data = worksheet.get_all_values()
            if not all_data:
                self.errors.append("Aucune donnée trouvée dans la feuille")
                self._log_sync('error')
                return False
                
            # Extraire les en-têtes et les données
            headers = all_data[0]
            rows = all_data[1:]
            
            # Traiter chaque ligne
            for row in rows:
                if len(row) == len(headers):  # Vérifier que la ligne a le bon nombre de colonnes
                    self.process_row(row, headers)
            
            # Déterminer le statut final
            if self.errors:
                status = 'partial' if self.records_imported > 0 else 'error'
            else:
                status = 'success'
                
            self._log_sync(status)
            return status == 'success' or status == 'partial'
            
        except Exception as e:
            self.errors.append(f"Erreur de synchronisation: {str(e)}")
            self._log_sync('error')
            return False
    
    def _log_sync(self, status):
        """Enregistre un log de synchronisation"""
        SyncLog.objects.create(
            status=status,
            records_imported=self.records_imported,
            errors='\n'.join(self.errors) if self.errors else None,
            sheet_config=self.sheet_config,
            triggered_by=self.triggered_by
        )
