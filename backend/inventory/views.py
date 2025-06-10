from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from .models import Stock, Product, Category, ProductImage
from django import forms
from django.forms import inlineformset_factory

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.is_staff

def is_operator(user):
    """Vérifie si l'utilisateur est un opérateur actif"""
    return user.is_authenticated and hasattr(user, 'operator_profile') and user.operator_profile.is_active

def is_admin_or_operator(user):
    """Vérifie si l'utilisateur est un admin ou un opérateur"""
    return is_admin(user) or is_operator(user)

class StockForm(forms.ModelForm):
    class Meta:
        model = Stock
        fields = ['article_code', 'article_name', 'color', 'size', 'quantity_available', 'photo', 'photo_url']
        widgets = {
            'article_code': forms.TextInput(attrs={'class': 'form-control'}),
            'article_name': forms.TextInput(attrs={'class': 'form-control'}),
            'color': forms.TextInput(attrs={'class': 'form-control'}),
            'size': forms.TextInput(attrs={'class': 'form-control'}),
            'quantity_available': forms.NumberInput(attrs={'class': 'form-control', 'min': '0'}),
            'photo': forms.FileInput(attrs={'class': 'form-control'}),
            'photo_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://...'})
        }

    def clean(self):
        cleaned_data = super().clean()
        photo = cleaned_data.get("photo")
        photo_url = cleaned_data.get("photo_url")

        if photo and photo_url:
            raise forms.ValidationError(
                "Vous ne pouvez pas fournir à la fois une photo locale et une URL. Veuillez choisir une seule option."
            )
        
        # Si une nouvelle URL est fournie, on supprime l'ancienne photo locale
        if photo_url and self.instance and self.instance.photo:
            self.instance.photo.delete(save=False) # Ne sauvegarde pas encore le modèle

        # Si une nouvelle photo locale est fournie, on vide l'ancienne URL
        if photo and self.instance and self.instance.photo_url:
            self.instance.photo_url = ''

        return cleaned_data

    def clean_photo(self):
        photo = self.cleaned_data.get('photo')
        if not photo and not self.instance.pk:  # Si pas de photo et nouvelle instance
            return None  # Retourne None au lieu de lever une erreur
        return photo

@login_required
@user_passes_test(is_admin_or_operator)
def stock_list(request):
    """Liste des articles en stock - accessible aux admins et opérateurs"""
    stocks = Stock.objects.all().order_by('article_code')
    
    # Déterminer si l'utilisateur peut modifier (seulement les admins)
    can_edit = is_admin(request.user)
    
    context = {
        'stocks': stocks,
        'can_edit': can_edit,
    }
    return render(request, 'inventory/stock_list.html', context)

@login_required
@user_passes_test(is_admin)
def stock_create(request):
    """Création d'un nouvel article en stock"""
    if request.method == 'POST':
        form = StockForm(request.POST, request.FILES)
        if form.is_valid():
            stock = form.save(commit=False)
            if not stock.photo:  # Si pas de photo
                stock.photo = None  # Explicitement mettre à None
            stock.save()
            messages.success(request, "Article ajouté au stock avec succès.")
            return redirect('inventory:stock_list')
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = StockForm()
    
    return render(request, 'inventory/stock_form.html', {'form': form})

@login_required
@user_passes_test(is_admin)
def stock_edit(request, stock_id):
    """Modification d'un article en stock"""
    stock = get_object_or_404(Stock, pk=stock_id)
    
    if request.method == 'POST':
        form = StockForm(request.POST, request.FILES, instance=stock)
        if form.is_valid():
            stock = form.save(commit=False)
            if not stock.photo:  # Si pas de photo
                stock.photo = None  # Explicitement mettre à None
            stock.save()
            messages.success(request, "Article mis à jour avec succès.")
            return redirect('inventory:stock_list')
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = StockForm(instance=stock)
    
    return render(request, 'inventory/stock_form.html', {'form': form})

@login_required
@user_passes_test(is_admin)
def stock_delete(request, stock_id):
    """Suppression d'un article en stock"""
    stock = get_object_or_404(Stock, pk=stock_id)
    
    if request.method == 'POST':
        stock.delete()
        messages.success(request, "Article supprimé avec succès.")
        return redirect('inventory:stock_list')
    
    context = {
        'stock': stock,
    }
    return render(request, 'inventory/stock_confirm_delete.html', context)

@login_required
def product_list(request):
    """Liste des produits - accessible aux admins et opérateurs"""
    products = Product.objects.select_related('category', 'stock').prefetch_related('images').order_by('-created_at')
    
    context = {
        'products': products,
        'can_edit': is_admin(request.user),
    }
    return render(request, 'inventory/product_list.html', context)

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            'name', 'reference', 'description', 'category', 'gender', 'price', 
            'old_price', 'available_sizes', 'colors', 'material', 'is_active', 
            'is_featured', 'meta_title', 'meta_description'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'reference': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'description': forms.Textarea(attrs={'rows': 4, 'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'category': forms.Select(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'gender': forms.Select(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'price': forms.NumberInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'old_price': forms.NumberInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'available_sizes': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'colors': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'material': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'}),
            'meta_title': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'meta_description': forms.Textarea(attrs={'rows': 2, 'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
        }

ProductImageFormSet = inlineformset_factory(
    Product, 
    ProductImage,
    fields=('image', 'image_url', 'alt_text', 'is_main'),
    extra=1, 
    can_delete=True,
    widgets={
        'image': forms.ClearableFileInput(attrs={'class': 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'}),
        'image_url': forms.URLInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md', 'placeholder': 'Ou coller une URL ici'}),
        'alt_text': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md', 'placeholder': "Texte alternatif pour l'image"}),
        'is_main': forms.CheckboxInput(attrs={'class': 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'}),
    }
)

@login_required
@user_passes_test(is_admin)
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        formset = ProductImageFormSet(request.POST, request.FILES, instance=Product())
        
        if form.is_valid() and formset.is_valid():
            product = form.save()
            formset.instance = product
            formset.save()
            messages.success(request, 'Le produit a été créé avec succès.')
            return redirect('inventory:product_list')
    else:
        form = ProductForm()
        formset = ProductImageFormSet(instance=Product())
    
    context = {
        'form': form,
        'formset': formset,
        'title': 'Ajouter un Produit'
    }
    return render(request, 'inventory/product_form.html', context)

@login_required
@user_passes_test(is_admin)
def product_edit(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        formset = ProductImageFormSet(request.POST, request.FILES, instance=product)

        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            messages.success(request, 'Le produit a été mis à jour avec succès.')
            return redirect('inventory:product_list')
    else:
        form = ProductForm(instance=product)
        formset = ProductImageFormSet(instance=product)

    context = {
        'form': form,
        'formset': formset,
        'product': product,
        'title': f'Modifier : {product.name}'
    }
    return render(request, 'inventory/product_form.html', context)

@login_required
@user_passes_test(is_admin)
def product_toggle_active(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        product.is_active = not product.is_active
        product.save()
        messages.success(request, f"Le statut du produit '{product.name}' a été mis à jour.")
    return redirect('inventory:product_list')

@login_required
@user_passes_test(is_admin)
def product_delete(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        product.delete()
        messages.success(request, 'Le produit a été supprimé avec succès.')
        return redirect('inventory:product_list')
    
    return render(request, 'inventory/product_confirm_delete.html', {'product': product})

# --- Vues pour la gestion des Catégories ---

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description', 'type', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'description': forms.Textarea(attrs={'rows': 3, 'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'type': forms.Select(attrs={'class': 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'}),
        }

@login_required
@user_passes_test(is_admin)
def category_list(request):
    categories = Category.objects.all().order_by('type', 'name')
    context = {
        'categories': categories,
    }
    return render(request, 'inventory/category_list.html', context)

@login_required
@user_passes_test(is_admin)
def category_create(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'La catégorie a été créée avec succès.')
            return redirect('inventory:category_list')
    else:
        form = CategoryForm()
    context = {'form': form, 'title': 'Créer une Catégorie'}
    return render(request, 'inventory/category_form.html', context)

@login_required
@user_passes_test(is_admin)
def category_edit(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            messages.success(request, 'La catégorie a été mise à jour avec succès.')
            return redirect('inventory:category_list')
    else:
        form = CategoryForm(instance=category)
    context = {'form': form, 'title': f'Modifier : {category.name}', 'category': category}
    return render(request, 'inventory/category_form.html', context)

@login_required
@user_passes_test(is_admin)
def category_delete(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if category.products.exists():
        messages.error(request, 'Impossible de supprimer cette catégorie car des produits y sont associés.')
        return redirect('inventory:category_list')
    
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'La catégorie a été supprimée avec succès.')
        return redirect('inventory:category_list')
        
    return render(request, 'inventory/category_confirm_delete.html', {'category': category})

@login_required
@user_passes_test(is_admin)
def category_toggle_active(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if request.method == 'POST':
        category.is_active = not category.is_active
        category.save()
        messages.success(request, f"Le statut de la catégorie '{category.name}' a été mis à jour.")
    return redirect('inventory:category_list')
