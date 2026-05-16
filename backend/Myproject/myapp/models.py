from django.db import models
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver


class HelpRequest(models.Model):
    STATUS_CHOICES = [
        ('open', 'Відкрито'),
        ('in_progress', 'У процесі'),
        ('closed', 'Закритий'),
        ('completed', 'Виповнений')
    ]

    URGENCY_CHOICES = [
        ('low', 'Низька'),
        ('medium', 'Середня'),
        ('high', 'Висока'),
        ('critical', 'Критична')
    ]
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    description = models.TextField(verbose_name='Опис ситуації')
    location = models.CharField(max_length=300, blank=True, null=True, verbose_name='Місцезнаходження')
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium', verbose_name='Терміновість')
    contact_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Контактний телефон')
    image = models.ImageField(upload_to='help_requests/', blank=True, null=True, verbose_name='Фото')
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests_made',verbose_name='Автор запиту')
    volunteer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='requests_taken',verbose_name='Волонтер')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата створення')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата оновлення')
    accepted_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата прийняття волонтером')
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Запит на допомогу'
        verbose_name_plural = 'Запити на допомогу'

    def __str__(self):
        return f'{self.title} - {self.get_status_display()}'


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('volunteer', 'Волонтер'),
        ('seeker', 'Шукаю допомогу'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name="Ім'я")
    surname = models.CharField(max_length=100, verbose_name='Прізвище')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='seeker', verbose_name='Роль')
    Avatar = models.ImageField(upload_to='avatars/', default='default.png', verbose_name='Аватар')
    bio = models.TextField(blank=True, max_length=500, default='Тут поки що нічого немає', verbose_name='Про себе')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name='Місто')

    class Meta:
        verbose_name = 'Профіль користувача'
        verbose_name_plural = 'Профілі користувачів'

    def __str__(self):
        return f'{self.user.username} - {self.get_role_display()}'

    def get_full_name(self):
        return f'{self.name} {self.surname}'


@receiver(post_save, sender=User)
def save_or_create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        if hasattr(instance, 'userprofile'):
            instance.userprofile.save()
        else:
            UserProfile.objects.create(user=instance)

class FavoriteRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    help_request = models.ForeignKey(HelpRequest, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'help_request')

    def __str__(self):
        return f"{self.user.username} saved {self.help_request.title}"