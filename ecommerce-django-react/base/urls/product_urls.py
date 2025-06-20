# ecommerce-django-react/base/urls/product_urls.py

from django.urls import path
from base.views.product_views import (
    getProducts,
    getProductCategories,
    getTopProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createProductReview,
)

urlpatterns = [
    # Список всех продуктов (с поддержкой ?keyword=… и ?category=…)
    path('',                     getProducts,           name='product-list'),
    # Уникальные категории
    path('categories/',          getProductCategories,  name='product-categories'),
    # Топ-5 продуктов по рейтингу
    path('top/',                 getTopProducts,        name='product-top'),
    # Подробности одного продукта
    path('<str:pk>/',            getProduct,            name='product-detail'),
    # Создание
    path('create/',              createProduct,         name='product-create'),
    # Редактирование
    path('update/<str:pk>/',     updateProduct,         name='product-update'),
    # Удаление
    path('delete/<str:pk>/',     deleteProduct,         name='product-delete'),
    # Загрузка картинки
    path('upload/',              uploadImage,           name='product-upload'),
    # Создание отзыва
    path('<str:pk>/review/',     createProductReview,   name='product-review-create'),
]
