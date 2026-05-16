from .models import UserProfile, HelpRequest
from django import forms

from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class ProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['Avatar', 'bio', 'role', 'phone', 'city']
        labels = {
            'Avatar': 'Аватар',
            'bio': 'Про себе',
            'role': 'Роль',
            'phone': 'Телефон',
            'city': 'Місто',
        }


class ExtendedSignupForm(UserCreationForm):
    ROLE_CHOICES = [
        ('volunteer', 'Волонтер'),
        ('seeker', 'Шукаю допомогу'),
    ]
    name = forms.CharField(label="Ім'я", required=True)
    surname = forms.CharField(label="Прізвище", required=True)
    role = forms.ChoiceField(choices=ROLE_CHOICES, required=True, label="Ваша роль")

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('role',)


class HelpRequestForm(forms.ModelForm):
    class Meta:
        model = HelpRequest
        fields = ['title', 'description', 'location', 'urgency', 'contact_phone', 'image']
        labels = {
            'title': 'Заголовок запиту',
            'description': 'Детальний опис ситуації',
            'location': 'Місцезнаходження потерпілого',
            'urgency': 'Терміновість',
            'contact_phone': 'Контактний телефон',
            'image': 'Фото (опціонально)',
        }
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'Наприклад: Потрібна допомога для літньої жінки',
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'placeholder': 'Детально опишіть ситуацію потерпілого: вік, стан здоров\'я, що саме потрібно...',
                'class': 'form-control',
                'rows': 5
            }),
            'location': forms.TextInput(attrs={
                'placeholder': 'Адреса або район',
                'class': 'form-control'
            }),
            'urgency': forms.Select(attrs={'class': 'form-control'}),
            'contact_phone': forms.TextInput(attrs={
                'placeholder': '+380',
                'class': 'form-control'
            }),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }


class HelpRequestSearchForm(forms.Form):
    URGENCY_CHOICES = [
        ('', 'Всі'),
        ('low', 'Низька'),
        ('medium', 'Середня'),
        ('high', 'Висока'),
        ('critical', 'Критична')
    ]

    query = forms.CharField(
        required=False,
        label='Пошук',
        widget=forms.TextInput(attrs={
            'placeholder': 'Пошук за ключовими словами...',
            'class': 'form-control'
        })
    )
    urgency = forms.ChoiceField(
        required=False,
        choices=URGENCY_CHOICES,
        label='Терміновість',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    location = forms.CharField(
        required=False,
        label='Місцезнаходження',
        widget=forms.TextInput(attrs={
            'placeholder': 'Місто або район',
            'class': 'form-control'
        })
    )