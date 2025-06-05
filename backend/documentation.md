# Documentation de l'Application de Gestion de Confirmation de Commandes

## Introduction

Cette application Django a été développée pour gérer la confirmation de commandes avec une synchronisation depuis Google Sheets. Elle permet aux administrateurs, opérateurs et au service logistique de gérer efficacement le processus de traitement des commandes.

## Fonctionnalités principales

1. **Synchronisation avec Google Sheets**
   - Importation des commandes depuis une feuille Google Sheet
   - Configuration personnalisable des sources de données
   - Logs de synchronisation pour le suivi des opérations

2. **Gestion des commandes**
   - Affichage des commandes par statut (à affecter, erronée, doublon)
   - Affectation individuelle ou multiple des commandes aux opérateurs
   - Annulation des commandes avec motif (pour les doublons ou erronées)
   - Suivi du statut des commandes (à confirmer, en cours, confirmée, annulée)

3. **Gestion des opérateurs**
   - Ajout, modification et suppression d'opérateurs
   - Affichage du nombre de commandes par opérateur
   - Interface dédiée pour les opérateurs

4. **Service logistique**
   - Affichage des commandes confirmées
   - Impression d'étiquettes
   - Marquage des commandes imprimées

5. **Gestion du stock**
   - Consultation du stock par article
   - Gestion des quantités disponibles

## Rôles utilisateurs

1. **Administrateur**
   - Accès à toutes les fonctionnalités
   - Gestion des opérateurs
   - Configuration de la synchronisation
   - Affectation des commandes

2. **Opérateur**
   - Affichage des commandes affectées
   - Modification des informations de commande
   - Confirmation des commandes
   - Consultation du stock

3. **Service logistique**
   - Affichage des commandes confirmées
   - Impression des étiquettes
   - Marquage des commandes imprimées

## Installation et démarrage

1. **Prérequis**
   - Python 3.8 ou supérieur
   - pip (gestionnaire de paquets Python)
   - Accès à Google Sheets API

2. **Installation**
   - Décompressez l'archive du projet
   - Placez le fichier `credentials.json` de Google API à la racine du projet
   - Exécutez le script de démarrage :
   ```
   ./start.sh
   ```

3. **Premier démarrage**
   - Le script créera automatiquement la base de données
   - Un compte administrateur sera créé avec les identifiants :
     - Utilisateur : `admin`
     - Mot de passe : `admin`
   - Il est recommandé de changer ce mot de passe après la première connexion

4. **Accès à l'application**
   - L'application sera accessible à l'adresse : http://127.0.0.1:8000/
   - Connectez-vous avec les identifiants administrateur

## Synchronisation avec Google Sheets

### Configuration

1. Accédez à la section "Synchronisation" dans le menu administrateur
2. Cliquez sur "Ajouter une configuration"
3. Renseignez l'URL de la feuille Google Sheet et le nom de l'onglet
4. Enregistrez la configuration

### Synchronisation manuelle

1. Dans le tableau de bord de synchronisation, cliquez sur le bouton "Synchroniser" à côté de la configuration souhaitée
2. Les résultats de la synchronisation seront affichés et enregistrés dans les logs

**Note importante** : La synchronisation automatique toutes les minutes n'est pas disponible dans cette version. Seule la synchronisation manuelle est implémentée.

## Gestion des commandes

### Affectation des commandes

1. **Affectation individuelle**
   - Accédez à la liste des commandes
   - Cliquez sur l'icône "Détail" d'une commande
   - Sélectionnez un opérateur dans la liste déroulante
   - Cliquez sur "Affecter"

2. **Affectation multiple**
   - Accédez à la page "Affectation multiple"
   - Sélectionnez les commandes à affecter
   - Choisissez un opérateur dans la liste déroulante
   - Cliquez sur "Affecter les commandes"

### Annulation des commandes

1. Accédez au détail d'une commande erronée ou en doublon
2. Cliquez sur "Annuler la commande"
3. Renseignez un motif d'annulation
4. Confirmez l'annulation

## Interface opérateur

1. L'opérateur se connecte avec ses identifiants
2. Il accède à son tableau de bord qui affiche les commandes qui lui sont affectées
3. Pour chaque commande, il peut :
   - Modifier les informations (client, téléphone, adresse, etc.)
   - Changer le statut de confirmation
   - Consulter le stock disponible

## Interface logistique

1. Le service logistique se connecte avec ses identifiants
2. Il accède à la liste des commandes confirmées
3. Il peut :
   - Imprimer les étiquettes individuellement ou en lot
   - Marquer les commandes comme imprimées
   - Filtrer les commandes déjà imprimées

## Maintenance et support

Pour toute question ou assistance technique, veuillez contacter l'équipe de support à l'adresse support@example.com.

## Limitations connues

- La synchronisation automatique n'est pas disponible, seule la synchronisation manuelle est implémentée
- L'impression d'étiquettes utilise une simulation d'impression via le navigateur
- Les performances peuvent varier selon le volume de données

---

© 2025 - Application de Gestion de Confirmation de Commandes
