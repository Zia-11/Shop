# ecommerce-django-react/backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Отдаём клиенту один index.html, React роутер сам выберет, что показывать
    path('', TemplateView.as_view(template_name='index.html')),

    # Все /api/products/... теперь обрабатывает product_urls
    path('api/products/', include('base.urls.product_urls')),

    # Аналогично для пользователей и заказов
    path('api/users/',    include('base.urls.user_urls')),
    path('api/orders/',   include('base.urls.order_urls')),
]

# Для отдачи медиа и статики
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
