from django.contrib import admin
from .models import Product, Review, Order, OrderItem, ShippingAddress


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'user',         # ← именно имя поля в модели, lowercase
        'createdAt',
        'totalPrice',
        'isPaid',
        'isDeliver',
    )
    list_filter = ('isPaid', 'isDeliver', 'createdAt')
    search_fields = ('user__username', '_id')
    readonly_fields = ('createdAt', 'paidAt', 'deliveredAt')

# (Опционально: чтобы вам было удобно смотреть и связанные объекты)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'countInStock', '_id')
    list_filter = ('brand', 'category')
    search_fields = ('name', 'brand', 'category', '_id')
    readonly_fields = ('createdAt',)

# Если хотите видеть отзывы в отдельной секции:
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'createdAt', '_id')
    list_filter = ('rating', 'createdAt')
    search_fields = ('product__name', 'user__username', '_id')


