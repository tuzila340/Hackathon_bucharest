
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.authentication import TokenAuthentication
from .models import HelpRequest, FavoriteRequest
from .serializers import HelpRequestSerializer, RegisterSerializer, UserProfileSerializer
from .forms import HelpRequestForm

#Cписок тільки відкритих запитів на головну, щоб не забити її завершеними
class HelpRequestListAPI(generics.ListCreateAPIView):
    queryset = HelpRequest.objects.filter(status='open').order_by('-created_at')
    serializer_class = HelpRequestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seeker=self.request.user)

# Клас для перегляду деталей, редагування або видалення конкретної допомоги
class HelpRequestDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = HelpRequest.objects.all()
    serializer_class = HelpRequestSerializer

# Це стара версія для Django templates, поки залишаю про всяк випадок для адмінки/тестів
class HelpRequestCreateView(LoginRequiredMixin, CreateView):
    model = HelpRequest
    form_class = HelpRequestForm
    template_name = 'requests/request_form.html'
    success_url = reverse_lazy('my_requests')

    def form_valid(self, form):
        form.instance.seeker = self.request.user
        form.instance.status = 'open'
        messages.success(self.request, 'Запит успішно створено')
        return super().form_valid(form)

# Реєстрація з миттєвою видачею токена, щоб юзеру не треба було логінитись одразу після створення аккаунта
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Знаходжу створеного юзера і віддаю йому ключ доступу
        user = User.objects.get(username=response.data['username'])
        token, created = Token.objects.get_or_create(user=user)
        response.data['token'] = token.key
        return response

# Повертаю профіль саме того, хто робить запит (через OneToOne зв'язок)юю
class ProfileUpdateAPI(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile

# Логіка для волонтерів: перевіряю чи волонтер юзер і чи не зайнятий запит кимось іншим
class AcceptHelpRequestAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(pk=pk)

            # тільки волонтери можуть тиснути цю кнопку
            if request.user.userprofile.role != 'volunteer':
                return Response({"error": "Тільки волонтери можуть приймати запити"}, status=status.HTTP_403_FORBIDDEN)

            if help_request.volunteer is not None:
                return Response({"error": "Цей запит вже прийнятий іншим волонтером"},
                                status=status.HTTP_400_BAD_REQUEST)

            help_request.volunteer = request.user
            help_request.status = 'accepted'
            help_request.save()

            serializer = HelpRequestSerializer(help_request)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except HelpRequest.DoesNotExist:
            return Response({"error": "Запит не знайдено"}, status=status.HTTP_404_NOT_FOUND)

# Коли волонтер зробив справу — змінюю статус на завершений
class CompleteHelpRequestAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(pk=pk)

            # Чужі завдання не можна завершати
            if help_request.volunteer != request.user:
                return Response({"error": "Ви не можете завершити чужий запит"}, status=status.HTTP_403_FORBIDDEN)

            help_request.status = 'completed'
            help_request.save()

            return Response({"status": "Запит успішно завершено"}, status=status.HTTP_200_OK)

        except HelpRequest.DoesNotExist:
            return Response({"error": "Запит не знайдено"}, status=status.HTTP_404_NOT_FOUND)

# Список постів які створив саме цей юзер
class MyHelpRequestsAPI(generics.ListAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HelpRequest.objects.filter(seeker=self.request.user).order_by('-created_at')

# Завдання які волонтер взяв на себе
class MyVolunteerTasksAPI(generics.ListAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HelpRequest.objects.filter(volunteer=self.request.user).order_by('-created_at')

# Реалізація через get_or_create: якщо вже є в обраному - видаляю якщо немає — додаю
class ToggleFavoriteAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        help_request = generics.get_object_or_404(HelpRequest, pk=pk)
        favorite, created = FavoriteRequest.objects.get_or_create(user=request.user, help_request=help_request)

        if not created:
            # Якщо запис вже був значить користувач хоче прибрати з обраного
            favorite.delete()
            return Response({"status": "removed from favorites"}, status=status.HTTP_200_OK)

        return Response({"status": "added to favorites"}, status=status.HTTP_201_CREATED)

# Виводжу тільки ті HelpRequest, які цей юзер позначив як улюблені
class MyFavoritesAPI(generics.ListAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HelpRequest.objects.filter(favorited_by__user=self.request.user)