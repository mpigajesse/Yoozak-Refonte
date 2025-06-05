# Script de démarrage pour l'application de gestion de commandes
# Ce script initialise l'environnement et démarre le serveur Django

# Activer l'environnement virtuel
Write-Host "Activation de l'environnement virtuel..."
.\venv\Scripts\Activate.ps1

# Vérifier si la base de données existe, sinon effectuer les migrations
if (-not (Test-Path db.sqlite3)) {
    Write-Host "Initialisation de la base de données..."
    python manage.py makemigrations accounts orders inventory sync logistics
    python manage.py migrate
    
    # Créer un superutilisateur pour l'administration
    Write-Host "Création d'un superutilisateur administrateur..."
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell
    
    # Créer un groupe pour le service logistique
    Write-Host "Création du groupe Logistics..."
    echo "from django.contrib.auth.models import Group; Group.objects.get_or_create(name='Logistics')" | python manage.py shell
    
    Write-Host "Base de données initialisée avec succès."
} else {
    Write-Host "Base de données existante détectée."
}

# Copier le fichier credentials.json s'il existe dans le répertoire d'upload
if (Test-Path "C:\Users\sohaib.baroud\upload\credentials.json") {
    Write-Host "Copie du fichier credentials.json..."
    Copy-Item "C:\Users\sohaib.baroud\upload\credentials.json" .
}

# Collecter les fichiers statiques
Write-Host "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# Démarrer le serveur Django
Write-Host "Démarrage du serveur Django..."
Write-Host "L'application sera accessible à l'adresse http://127.0.0.1:8000/"
Write-Host "Utilisez les identifiants suivants pour vous connecter:"
Write-Host "  - Administrateur: admin / admin"
python manage.py runserver 0.0.0.0:8000 