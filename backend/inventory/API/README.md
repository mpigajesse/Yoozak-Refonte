# API de l'Inventaire - Yoozak

Cette documentation détaille les endpoints de l'API pour la gestion de l'inventaire de la boutique Yoozak. Elle permet de récupérer les informations sur les produits, les catégories et leurs relations.

## Authentification

Les endpoints de cette API sont en **lecture seule** (`GET`) pour tous les utilisateurs, y compris les non authentifiés. Aucune clé d'API ou token n'est nécessaire pour consulter les données.

Les actions d'écriture (non implémentées ici) nécessiteraient une authentification d'administrateur.

---

## Endpoints des Catégories

### 1. Lister les Catégories Hiérarchisées (pour les menus)

Endpoint idéal pour construire les menus et la navigation du site. Il groupe les sous-catégories par type de produit principal.

- **URL :** `/api/inventory/categories/nested/`
- **Méthode :** `GET`
- **Réponse Succès (200 OK) :**
  ```json
  [
      {
          "type_name": "Sandales",
          "type_slug": "sandales",
          "subcategories": [
              {
                  "id": 2,
                  "name": "Sandales Élégantes",
                  "slug": "sandales-elegantes",
                  "description": "Des sandales pour un look chic.",
                  "type": "sandales"
              },
              {
                  "id": 3,
                  "name": "Sandales Fashion",
                  "slug": "sandale-femme-fashion-yz498",
                  "description": "",
                  "type": "sandales"
              }
          ]
      },
      {
          "type_name": "Mules",
          "type_slug": "mules",
          "subcategories": [
              {
                  "id": 7,
                  "name": "Mules Élégantes",
                  "slug": "mule-femme-elegante-yz1363",
                  "description": "",
                  "type": "mules"
              }
          ]
      }
  ]
  ```

### 2. Lister toutes les Catégories (liste plate)

Retourne une liste simple de toutes les sous-catégories.

- **URL :** `/api/inventory/categories/`
- **Méthode :** `GET`

### 3. Détails d'une Catégorie

- **URL :** `/api/inventory/categories/{slug}/`
- **Méthode :** `GET`
- **Paramètre :**
  - `{slug}` (string) : Le slug de la catégorie (ex: `sandales-elegantes`).

### 4. Lister les produits d'une catégorie

- **URL :** `/api/inventory/categories/{slug}/products/`
- **Méthode :** `GET`

---

## Endpoints des Produits

### 1. Lister tous les Produits

Retourne une liste paginée de tous les produits actifs.

- **URL :** `/api/inventory/products/`
- **Méthode :** `GET`
- **Fonctionnalités :**
    - **Filtrage :**
        - `?category__slug={slug}` : Par slug de catégorie (ex: `mules-elegantes`).
        - `?gender={genre}` : Par genre (ex: `homme`, `femme`).
        - `?is_featured=true` : Pour les produits mis en avant.
    - **Recherche :**
        - `?search={terme}` : Recherche dans le nom, la référence et la description.
    - **Tri :**
        - `?ordering=price` : Trier par prix (croissant).
        - `?ordering=-price` : Trier par prix (décroissant).
        - `?ordering=created_at` : Trier par date de création.

- **Exemple de réponse (200 OK) :**
  ```json
  {
      "count": 7,
      "next": null,
      "previous": null,
      "results": [
          {
              "id": 7,
              "name": "Mule Femme Élégante YZ1363",
              "slug": "mule-femme-elegante-yz1363",
              "reference": "YZ1363",
              "category": {
                  "id": 7,
                  "name": "Mules Élégantes",
                  "slug": "mules-elegantes",
                  "description": "",
                  "type": "mules"
              },
              "gender": "femme",
              "price": "279.00",
              "old_price": null,
              "main_image": {
                  "id": 169,
                  "image": "http://127.0.0.1:8000/media/products/CHAUSS%20FEM%20YZ1363/noir/1.jpg",
                  "alt_text": "Mule Femme Élégante YZ1363 - noir",
                  "is_main": true,
                  "order": 0
              },
              "is_active": true,
              "is_featured": false,
              "stock_status": "Non géré"
          }
      ]
  }
  ```

### 2. Détails d'un Produit

Retourne toutes les informations d'un produit spécifique, y compris la liste complète de ses images.

- **URL :** `/api/inventory/products/{slug}/`
- **Méthode :** `GET`
- **Paramètre :**
  - `{slug}` (string) : Le slug du produit (ex: `sandale-homme-confort-yz625`).

- **Exemple de réponse (200 OK) :**
  ```json
  {
    "id": 1,
    "name": "Sandale Homme Confort YZ625",
    "slug": "sandale-homme-confort-yz625",
    // ... autres champs ...
    "images": [
        {
            "id": 31,
            "image": "http://127.0.0.1:8000/media/products/SDL%20HOM%20YZ625/MARRON/IMG_4521.JPG",
            "alt_text": "Sandale Homme Confort YZ625 - MARRON",
            "is_main": false,
            "order": 1
        },
        // ... autres images
    ],
    "available_sizes": ["40", "41", "42", "43"],
    "colors": ["TABAC", "NOIR", "MARRON"],
    // ...
  }
  ```
  
### 3. Endpoints Spécifiques (Actions)

- **Lister les produits similaires :**
  - **URL :** `/api/inventory/products/{slug}/similar/`
  - **Description :** Retourne jusqu'à 4 produits de la même catégorie et du même genre.

- **Lister les images d'un produit :**
  - **URL :** `/api/inventory/products/{slug}/images/`
  - **Description :** Retourne la liste complète des images pour un produit donné.

- **Lister les produits mis en avant :**
  - **URL :** `/api/inventory/products/featured/`
  
- **Lister les produits par genre :**
  - **URL :** `/api/inventory/products/by_gender/?gender={genre}`
  - **Paramètre :** `gender` (ex: `homme`, `femme`, `unisexe`). 