from django.contrib import admin
from .models import Product, Review, Order, OrderItem, ShippingAddress


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'user_name',   
        'user_email', 
        'createdAt',
        'totalPrice',
        'isPaid',
        'isDeliver',
    )
    list_filter = ('isPaid', 'isDeliver', 'createdAt')
    readonly_fields = ('createdAt', 'paidAt', 'deliveredAt')

    def user_name(self, obj):
        # показываем либо first_name, либо username на всякий случай
        return obj.user.first_name or obj.user.username
    user_name.short_description = 'Name'

    def user_email(self, obj):
        # если вдруг e-mail ещё не заполнен, вернёт пустую строку
        return obj.user.email
    user_email.short_description = 'E-mail'

# остальное без изменений
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'countInStock', '_id')
    list_filter = ('brand', 'category')
    search_fields = ('name', 'brand', 'category', '_id')
    readonly_fields = ('createdAt',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'createdAt', '_id')
    list_filter = ('rating', 'createdAt')
    search_fields = ('product__name', 'user__username', '_id')


