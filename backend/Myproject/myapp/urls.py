from . import views
from django.urls import path
from rest_framework.authtoken import views as auth_views

urlpatterns = [
    #запити
    path('requests/', views.HelpRequestListAPI.as_view(), name='api_list'),
    path('requests/<int:pk>/', views.HelpRequestDetailAPI.as_view(), name='api_detail'),

    # користувачі
    path('register/', views.RegisterView.as_view(), name='api_register'),
    path('profile/', views.ProfileUpdateAPI.as_view(), name='api_profile'),
    path('login/', auth_views.obtain_auth_token, name='api_login'),
    path('requests/<int:pk>/accept/', views.AcceptHelpRequestAPI.as_view(), name='api_acept_request'),
    path('requests/<int:pk>/complete/', views.CompleteHelpRequestAPI.as_view(), name='api_complete_request'),
    path('my-requests/', views.MyHelpRequestsAPI.as_view(), name='my_requests'),
    path('my-tasks/', views.MyVolunteerTasksAPI.as_view(), name='my_tasks'),
    path('requests/<int:pk>/favorite/', views.ToggleFavoriteAPI.as_view(), name='api_toggle_favorite'),
    path('my-favorites/', views.MyFavoritesAPI.as_view(), name='my_favorites'),
]