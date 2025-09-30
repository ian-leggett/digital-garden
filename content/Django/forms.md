---
title: "Forms"
tags:
  - django
description: ""
date: 2025-05-29
---



## What are Django Forms?
Django forms handle form rendering, validation, and processing, providing a secure and convenient way to collect user input.

## Basic Form
```python
from django import forms

class BookForm(forms.Form):
    title = forms.CharField(max_length=200)
    author = forms.CharField(max_length=100)
    genre = forms.ChoiceField(choices=[
        ('fiction', 'Fiction'),
        ('non-fiction', 'Non-Fiction'),
        ('sci-fi', 'Science Fiction'),
        ('mystery', 'Mystery'),
        ('biography', 'Biography'),
    ])
    published_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    description = forms.CharField(widget=forms.Textarea, required=False)
    price = forms.DecimalField(max_digits=6, decimal_places=2, required=False)
    is_available = forms.BooleanField(initial=True, required=False)
```

## ModelForm
```python
from django import forms
from .models import Book

class BookModelForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'published_date', 'description', 'price', 'is_available']
        # Alternative: exclude = ['created_at', 'updated_at']
        # OR use fields = '__all__' to include all fields
        
        widgets = {
            'published_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 4}),
        }
        
        labels = {
            'is_available': 'Available in store',
        }
        
        help_texts = {
            'price': 'Enter price in USD',
        }
```

## Common Form Fields
- `CharField`: Text input
- `EmailField`: Email validation
- `IntegerField`: Integer input
- `DecimalField`: Decimal number input
- `DateField`: Date input
- `BooleanField`: Checkbox
- `ChoiceField`: Select dropdown
- `MultipleChoiceField`: Multiple select
- `FileField`: File upload
- `ImageField`: Image upload (requires Pillow)

## Field Options
```python
forms.CharField(
    max_length=100,              # Maximum length
    min_length=10,               # Minimum length
    required=True,               # Field is required (default)
    label='Custom Label',        # Custom field label
    help_text='Help text here',  # Help text
    initial='Default value',     # Initial value
    widget=forms.Textarea,       # Custom widget
    validators=[custom_validator] # Custom validation
)
```

## Widgets
```python
# Common widgets
forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter title'})
forms.Textarea(attrs={'rows': 4, 'cols': 40})
forms.Select(choices=CHOICES)
forms.CheckboxInput()
forms.DateInput(attrs={'type': 'date'})
forms.FileInput()
forms.RadioSelect(choices=CHOICES)
forms.PasswordInput()
```

## Form Validation
```python
from django import forms
from django.core.validators import MinLengthValidator

class BookForm(forms.Form):
    title = forms.CharField(validators=[MinLengthValidator(3)])
    isbn = forms.CharField(max_length=13)
    
    # Clean a specific field
    def clean_isbn(self):
        isbn = self.cleaned_data['isbn']
        if not isbn.isdigit():
            raise forms.ValidationError("ISBN must contain only digits")
        return isbn
    
    # Clean multiple fields
    def clean(self):
        cleaned_data = super().clean()
        title = cleaned_data.get('title')
        isbn = cleaned_data.get('isbn')
        
        if title and isbn and title.lower() == isbn.lower():
            raise forms.ValidationError("Title and ISBN cannot be identical")
        
        return cleaned_data
```

## Using Forms in Views
```python
# Function-based view
def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            # Process form data
            title = form.cleaned_data['title']
            # Save data or perform actions
            return redirect('success_url')
    else:
        form = BookForm()
    
    return render(request, 'book_form.html', {'form': form})

# With ModelForm
def book_create(request):
    if request.method == 'POST':
        form = BookModelForm(request.POST)
        if form.is_valid():
            book = form.save()  # Creates and saves the Book instance
            return redirect('book_detail', id=book.id)
    else:
        form = BookModelForm()
    
    return render(request, 'book_form.html', {'form': form})
```

## Rendering Forms in Templates
```html
<!-- Basic form rendering -->
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>

<!-- Manual form rendering -->
<form method="post">
    {% csrf_token %}
    
    <div class="form-group">
        {{ form.title.errors }}
        <label for="{{ form.title.id_for_label }}">Title:</label>
        {{ form.title }}
        {% if form.title.help_text %}
            <small>{{ form.title.help_text }}</small>
        {% endif %}
    </div>
    
    <!-- More fields... -->
    
    <button type="submit">Submit</button>
</form>
```

## Formsets
```python
# For handling multiple forms of the same type
from django.forms import formset_factory, modelformset_factory

# Basic formset
BookFormSet = formset_factory(BookForm, extra=3)
formset = BookFormSet()

# Model formset
BookModelFormSet = modelformset_factory(Book, fields=['title', 'author'], extra=2)
formset = BookModelFormSet(queryset=Book.objects.filter(is_available=True))

# In a view:
if request.method == 'POST':
    formset = BookFormSet(request.POST)
    if formset.is_valid():
        for form in formset:
            # Process each form
            pass
```

## Best Practices
1. Use ModelForm when working with models
2. Add custom validation for complex rules
3. Set appropriate widgets for better UX
4. Use formsets for multiple related items
5. Include CSRF protection
6. Add custom error messages
7. Implement proper field cleaning
8. Handle file uploads correctly with enctype="multipart/form-data"

This guide covers the essentials for working with Django forms.