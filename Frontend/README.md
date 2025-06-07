# 🥿 YOOZAK - Frontend E-commerce

> Plateforme e-commerce moderne spécialisée dans les chaussures artisanales (sandales, mules, sabots)

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Structure du projet](#-structure-du-projet)
- [🔗 Intégration Django](#-intégration-django)
- [📡 API Documentation](#-api-documentation)
- [🎨 Design System](#-design-system)
- [🧪 Tests](#-tests)
- [📦 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)

## 🎯 Vue d'ensemble

YOOZAK est une plateforme e-commerce moderne construite avec React 18, TypeScript et Tailwind CSS. Le projet est conçu pour être facilement intégrable avec un backend Django Rest Framework.

### ✨ Fonctionnalités principales

- 🛍️ **Catalogue produits** avec filtres avancés
- 🔍 **Recherche intelligente** avec suggestions
- 👤 **Authentification** JWT avec refresh tokens
- 🛒 **Panier** persistant avec gestion des sessions
- 💳 **Paiements** sécurisés (Stripe, PayPal)
- 📱 **Design responsive** mobile-first
- 📝 **Blog intégré** avec gestion de contenu
- ⭐ **Système d'avis** clients
- 📊 **Dashboard admin** avec statistiques
- 🌍 **Multi-langues** (prévu)

### 🛠️ Technologies utilisées

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios avec intercepteurs
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 🏗️ Architecture

```
Frontend (React + TypeScript)
├── 🎨 UI Components (Tailwind CSS)
├── 📡 API Services (Axios)
├── 🔄 State Management (Zustand)
├── 🛣️ Routing (React Router)
└── 📱 Responsive Design (Mobile-First)
           ↕️
Backend (Django Rest Framework)
├── 🔐 JWT Authentication
├── 📊 PostgreSQL Database
├── 🖼️ Media Storage
├── 💳 Payment Integration
└── 📧 Email Services
```

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Git

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-repo/yoozak-frontend.git
cd yoozak-frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STATIC_URL=http://localhost:8000/static
VITE_MEDIA_URL=http://localhost:8000/media

# Environment
VITE_NODE_ENV=development

# Payment (optionnel)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=...

# Analytics (optionnel)
VITE_GOOGLE_ANALYTICS_ID=G-...
```

### Configuration des environments

Le projet supporte 3 environnements :
- `development` - Développement local
- `staging` - Environnement de test
- `production` - Production

## 📁 Structure du projet

```
src/
├── 📱 components/          # Composants réutilisables
│   ├── ui/                # Composants UI de base
│   ├── forms/             # Composants de formulaires
│   └── layout/            # Composants de mise en page
├── 📄 pages/              # Pages de l'application
│   ├── HomePage.tsx       # Page d'accueil
│   ├── ProductsPage.tsx   # Liste des produits
│   ├── ProductDetailPage.tsx # Détail produit
│   ├── CartPage.tsx       # Panier
│   ├── CheckoutPage.tsx   # Commande
│   ├── AuthPage.tsx       # Authentification
│   └── BlogPage.tsx       # Blog
├── 🔧 services/           # Services API
│   ├── api.ts            # Service API principal
│   ├── authService.ts    # Authentification
│   ├── productService.ts # Produits
│   └── index.ts          # Export centralisé
├── 🎯 types/              # Types TypeScript
│   └── index.ts          # Types centralisés
├── ⚙️ config/             # Configuration
│   └── api.ts            # Configuration API
├── 🗃️ store/              # État global (Zustand)
│   ├── authStore.ts      # Store authentification
│   ├── cartStore.ts      # Store panier
│   └── productStore.ts   # Store produits
├── 🎨 styles/             # Styles globaux
├── 🛠️ utils/              # Utilitaires
├── 📊 data/               # Données mock
└── 🧪 __tests__/          # Tests
```

## 🔗 Intégration Django

### 🔧 Configuration Backend attendue

Le frontend est conçu pour fonctionner avec un backend Django Rest Framework avec les endpoints suivants :

#### 🔐 Authentification
```python
# urls.py
urlpatterns = [
    path('api/auth/login/', LoginView.as_view()),
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/logout/', LogoutView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/auth/profile/', ProfileView.as_view()),
]
```

#### 🛍️ Produits
```python
# urls.py
urlpatterns = [
    path('api/products/', ProductListView.as_view()),
    path('api/products/<uuid:id>/', ProductDetailView.as_view()),
    path('api/products/search/', ProductSearchView.as_view()),
    path('api/products/featured/', FeaturedProductsView.as_view()),
]
```

### 📝 Modèles Django requis

```python
# models.py
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    description = models.TextField()
    color = models.CharField(max_length=50, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_new = models.BooleanField(default=False)
    is_sale = models.BooleanField(default=False)
    discount = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 🔄 Format des réponses API

#### Authentification
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Produits (paginés)
```json
{
  "count": 150,
  "next": "http://api.example.com/products/?page=3",
  "previous": "http://api.example.com/products/?page=1",
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
             "name": "Sandales Cuir Élégantes",
       "category": "men",
       "type": "sandale",
       "price": "1899.00",
      "image": "/media/products/sandales.jpg",
      "description": "Description du produit...",
      "color": "Marron",
      "stock": 15,
      "rating": 4.5,
      "reviewsCount": 128,
      "isNew": true,
      "isSale": false,
      "discount": 0
    }
  ]
}
```

## 📡 API Documentation

### 🔍 Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login/` | Connexion utilisateur |
| `POST` | `/api/auth/register/` | Inscription utilisateur |
| `GET` | `/api/products/` | Liste des produits |
| `GET` | `/api/products/{id}/` | Détail d'un produit |
| `GET` | `/api/products/search/?q={query}` | Recherche produits |
| `GET` | `/api/cart/` | Panier utilisateur |
| `POST` | `/api/cart/add/` | Ajouter au panier |
| `POST` | `/api/orders/` | Créer une commande |

### 🔄 Headers requis

```javascript
// Authentification
Authorization: Bearer {access_token}

// Content-Type pour JSON
Content-Type: application/json

// Content-Type pour upload de fichiers
Content-Type: multipart/form-data
```

### 🏷️ Gestion des erreurs

```json
// Erreur de validation (400)
{
  "errors": {
    "email": ["Ce champ est requis."],
    "password": ["Le mot de passe est trop court."]
  }
}

// Erreur d'authentification (401)
{
  "detail": "Token invalide."
}

// Erreur serveur (500)
{
  "message": "Erreur interne du serveur."
}
```

## 🎨 Design System

### 🎨 Palette de couleurs

```css
/* Couleurs principales */
--primary: #000000      /* Noir principal */
--secondary: #374151    /* Gris foncé */
--accent: #F59E0B       /* Accent doré */

/* Couleurs système */
--success: #10B981      /* Vert */
--warning: #F59E0B      /* Orange */
--error: #EF4444        /* Rouge */
--info: #3B82F6         /* Bleu */

/* Couleurs neutres */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

### 📐 Espacement et typographie

```css
/* Espacement */
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */

/* Typographie */
--font-family: 'Inter', sans-serif
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
```

### 🧩 Composants

Le projet utilise des composants modulaires et réutilisables :

- **Button** - Boutons avec variantes (primary, secondary, outline)
- **Input** - Champs de saisie avec validation
- **Card** - Cartes de contenu
- **Modal** - Fenêtres modales
- **Toast** - Notifications
- **Loader** - Indicateurs de chargement

## 🧪 Tests

### Configuration des tests

```bash
# Lancer tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

### Types de tests

- **Tests unitaires** - Composants individuels
- **Tests d'intégration** - Services API
- **Tests e2e** - Parcours utilisateur complets

## 📦 Déploiement

### 🚀 Build de production

```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

### 🌐 Déploiement automatique

Le projet est configuré pour le déploiement automatique sur :

- **Netlify** (recommandé)
- **Vercel**
- **GitHub Pages**

### 📁 Variables d'environnement production

```env
VITE_API_BASE_URL=https://api.yoozak.com/api
VITE_STATIC_URL=https://api.yoozak.com/static
VITE_MEDIA_URL=https://api.yoozak.com/media
VITE_NODE_ENV=production
VITE_CURRENCY=MAD
VITE_CURRENCY_SYMBOL=DH
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run preview         # Prévisualiser le build

# Qualité de code
npm run lint            # Linter ESLint
npm run lint:fix        # Corriger automatiquement
npm run type-check      # Vérification TypeScript

# Tests
npm run test            # Lancer les tests
npm run test:coverage   # Coverage des tests
```

## 🛠️ Outils de développement

### Extensions VS Code recommandées

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Configuration Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🤝 Contribution

### 🔄 Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos modifications et commits
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Pousser la branche
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request
```

### 📝 Convention de commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: ajout de tests
chore: tâches de maintenance
```

## 📞 Support

### 🐛 Problèmes courants

#### Erreur CORS
```bash
# Vérifier la configuration Django CORS
pip install django-cors-headers
```

#### Erreur de token
```bash
# Vérifier la configuration JWT Django
pip install djangorestframework-simplejwt
```

### 📧 Contact

- **Email**: dev@yoozak.com
- **Documentation**: [docs.yoozak.com](https://docs.yoozak.com)
- **Issues**: [GitHub Issues](https://github.com/votre-repo/yoozak/issues)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🚀 Prêt pour l'intégration Django !**

Ce frontend a été spécialement conçu pour une intégration facile avec Django Rest Framework. Suivez la documentation API ci-dessus pour implémenter les endpoints correspondants côté backend. 