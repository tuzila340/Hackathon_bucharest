from django.urls import path
from rest_framework.authtoken import views as auth_views
from . import views
from .views import HelpRequestListAPI,HelpRequestDetailAPI




urlpatterns = [
    # запити
    #path('api/requests/', views.HelpRequestListAPI.as_view(), name='api_list'),
    #path('api/requests/<int:pk>/', views.HelpRequestDetailAPI.as_view(), name='api_detail'),
    path('api/requests/', HelpRequestListAPI.as_view(), name='request-list'),
    path('api/requests/<int:pk>/', HelpRequestDetailAPI.as_view(), name='request-detail'),

    # користувачі
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/profile/', views.ProfileUpdateAPI.as_view(), name='api_profile'),
    path('api/login/', auth_views.obtain_auth_token, name='api_login'),  # Тепер збігається з фронтом!

    # дії волонтера
    path('api/requests/<int:pk>/accept/', views.AcceptHelpRequestAPI.as_view(), name='api_acept_request'),
    path('api/requests/<int:pk>/complete/', views.CompleteHelpRequestAPI.as_view(), name='api_complete_request'),

    # особистий кабінет
    path('api/my-requests/', views.MyHelpRequestsAPI.as_view(), name='my_requests'),
    path('api/my-tasks/', views.MyVolunteerTasksAPI.as_view(), name='my_tasks'),
    path('api/requests/<int:pk>/favorite/', views.ToggleFavoriteAPI.as_view(), name='api_toggle_favorite'),
    path('api/my-favorites/', views.MyFavoritesAPI.as_view(), name='my_favorites'),
]