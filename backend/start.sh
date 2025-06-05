#!/bin/bash

# Script de démarrage pour l'application de gestion de commandes
# Ce script initialise l'environnement et démarre le serveur Django

# Activer l'environnement virtuel
echo "Activation de l'environnement virtuel..."
source venv/bin/activate

# Vérifier si la base de données existe, sinon effectuer les migrations
if [ ! -f db.sqlite3 ]; then
    echo "Initialisation de la base de données..."
    python manage.py makemigrations accounts orders inventory sync logistics
    python manage.py migrate
    
    # Créer un superutilisateur pour l'administration
    echo "Création d'un superutilisateur administrateur..."
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell
    
    # Créer un groupe pour le service logistique
    echo "Création du groupe Logistics..."
    echo "from django.contrib.auth.models import Group; Group.objects.get_or_create(name='Logistics')" | python manage.py shell
    
    echo "Base de données initialisée avec succès."
else
    echo "Base de données existante détectée."
fi

# Copier le fichier credentials.json s'il existe dans le répertoire d'upload
if [ -f /home/ubuntu/upload/credentials.json ]; then
    echo "Copie du fichier credentials.json..."
    cp /home/ubuntu/upload/credentials.json .
fi

# Collecter les fichiers statiques
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# Démarrer le serveur Django
echo "Démarrage du serveur Django..."
echo "L'application sera accessible à l'adresse http://127.0.0.1:8000/"
echo "Utilisez les identifiants suivants pour vous connecter:"
echo "  - Administrateur: admin / admin"
python manage.py runserver 0.0.0.0:8000
