from django.core.management.base import BaseCommand
from django.db.models import Q
from client.models import Client
from orders.models import Order
from django.contrib.auth.models import User
import re


class Command(BaseCommand):
    help = 'Lie automatiquement les commandes existantes aux clients correspondants'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Affiche ce qui serait fait sans l\'exécuter',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force la mise à jour même si une liaison existe déjà',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']
        
        self.stdout.write(
            self.style.SUCCESS('🔗 Début de la liaison commandes-clients...')
        )
        
        # Récupérer toutes les commandes sans client lié ou forcer la mise à jour
        if force:
            orders = Order.objects.all()
            self.stdout.write(f"Mode force activé - Traitement de {orders.count()} commandes")
        else:
            orders = Order.objects.filter(client__isnull=True)
            self.stdout.write(f"Traitement de {orders.count()} commandes sans client lié")
        
        if not orders.exists():
            self.stdout.write(
                self.style.WARNING('Aucune commande à traiter.')
            )
            return
        
        stats = {
            'linked_by_email': 0,
            'linked_by_phone': 0,
            'linked_by_name': 0,
            'no_match': 0,
            'multiple_matches': 0,
            'updated': 0
        }
        
        for order in orders:
            client = self.find_matching_client(order)
            
            if client:
                # Déterminer la méthode de correspondance
                match_method = self.get_match_method(order, client)
                stats[match_method] += 1
                
                if not dry_run:
                    if force or not order.client:
                        order.client = client
                        order.save()
                        stats['updated'] += 1
                
                self.stdout.write(
                    f"✅ Commande {order.order_number} → Client {client.user.get_full_name() or client.user.username} "
                    f"({match_method.replace('_', ' ')})"
                )
            else:
                stats['no_match'] += 1
                self.stdout.write(
                    f"❌ Commande {order.order_number} - Aucun client correspondant trouvé "
                    f"(nom: {order.client_name}, tél: {order.phone})"
                )
        
        # Afficher les statistiques
        self.display_stats(stats, dry_run)

    def find_matching_client(self, order):
        """Trouve un client correspondant à une commande"""
        
        # 1. Recherche par email si disponible dans les informations de commande
        if hasattr(order, 'email') and order.email:
            client = Client.objects.filter(user__email__iexact=order.email).first()
            if client:
                return client
        
        # 2. Recherche par numéro de téléphone (exact)
        if order.phone:
            # Nettoyer le numéro de téléphone
            clean_phone = self.clean_phone_number(order.phone)
            if clean_phone:
                client = Client.objects.filter(
                    phone__icontains=clean_phone
                ).first()
                if client:
                    return client
        
        # 3. Recherche par nom complet
        if order.client_name:
            # Essayer de faire correspondre avec le nom complet de l'utilisateur
            name_parts = order.client_name.strip().split()
            if len(name_parts) >= 2:
                first_name = name_parts[0]
                last_name = ' '.join(name_parts[1:])
                
                client = Client.objects.filter(
                    Q(user__first_name__iexact=first_name, user__last_name__iexact=last_name) |
                    Q(user__first_name__icontains=first_name, user__last_name__icontains=last_name)
                ).first()
                
                if client:
                    return client
        
        # 4. Recherche par similarité de nom (plus flexible)
        if order.client_name:
            clients = Client.objects.select_related('user').all()
            for client in clients:
                full_name = f"{client.user.first_name} {client.user.last_name}".strip()
                if full_name and self.names_are_similar(order.client_name, full_name):
                    return client
        
        return None

    def get_match_method(self, order, client):
        """Détermine la méthode utilisée pour faire correspondre la commande au client"""
        
        # Vérifier email
        if hasattr(order, 'email') and order.email and order.email.lower() == client.user.email.lower():
            return 'linked_by_email'
        
        # Vérifier téléphone
        if order.phone and client.phone:
            clean_order_phone = self.clean_phone_number(order.phone)
            clean_client_phone = self.clean_phone_number(client.phone)
            if clean_order_phone and clean_client_phone and clean_order_phone in clean_client_phone:
                return 'linked_by_phone'
        
        # Par défaut, correspondance par nom
        return 'linked_by_name'

    def clean_phone_number(self, phone):
        """Nettoie un numéro de téléphone pour la comparaison"""
        if not phone:
            return None
        
        # Supprimer tous les caractères non numériques sauf le +
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # Supprimer les zéros en début si c'est un numéro local
        if cleaned.startswith('0'):
            cleaned = cleaned[1:]
        
        # Supprimer l'indicatif pays marocain si présent
        if cleaned.startswith('+212'):
            cleaned = cleaned[4:]
        elif cleaned.startswith('212'):
            cleaned = cleaned[3:]
        
        return cleaned if len(cleaned) >= 8 else None

    def names_are_similar(self, name1, name2, threshold=0.7):
        """Vérifie si deux noms sont similaires"""
        if not name1 or not name2:
            return False
        
        name1 = name1.lower().strip()
        name2 = name2.lower().strip()
        
        # Correspondance exacte
        if name1 == name2:
            return True
        
        # Vérifier si un nom est contenu dans l'autre
        if name1 in name2 or name2 in name1:
            return True
        
        # Correspondance par mots
        words1 = set(name1.split())
        words2 = set(name2.split())
        
        if words1 and words2:
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            similarity = len(intersection) / len(union)
            return similarity >= threshold
        
        return False

    def display_stats(self, stats, dry_run):
        """Affiche les statistiques finales"""
        self.stdout.write(
            self.style.SUCCESS('\n📊 STATISTIQUES:')
        )
        
        self.stdout.write(f"  • Correspondance par email: {stats['linked_by_email']}")
        self.stdout.write(f"  • Correspondance par téléphone: {stats['linked_by_phone']}")
        self.stdout.write(f"  • Correspondance par nom: {stats['linked_by_name']}")
        self.stdout.write(f"  • Aucune correspondance: {stats['no_match']}")
        
        total_matched = stats['linked_by_email'] + stats['linked_by_phone'] + stats['linked_by_name']
        total_processed = total_matched + stats['no_match']
        
        if total_processed > 0:
            success_rate = (total_matched / total_processed) * 100
            self.stdout.write(f"  • Taux de réussite: {success_rate:.1f}%")
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'\n🔍 MODE SIMULATION - Aucune modification effectuée')
            )
            self.stdout.write(
                self.style.WARNING(f'Exécutez sans --dry-run pour appliquer les changements')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'\n✅ {stats["updated"]} commandes mises à jour avec succès!')
            ) 