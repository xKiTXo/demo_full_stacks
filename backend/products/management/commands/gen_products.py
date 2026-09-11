from django.core.management.base import BaseCommand
from products.models import Product, Category, Brand
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Generate 100 sample products'

    def handle(self, *args, **options):
        categories = list(Category.objects.all())
        brands = list(Brand.objects.all())

        if not categories:
            cat_names = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Cooler']
            categories = [Category.objects.create(name=n) for n in cat_names]

        if not brands:
            brand_names = ['ASUS', 'MSI', 'Gigabyte', 'Intel', 'AMD', 'Corsair', 'Samsung', 'Kingston']
            brands = [Brand.objects.create(name=n) for n in brand_names]

        product_names = [
            'Intel Core i5-14400F', 'Intel Core i7-14700K', 'AMD Ryzen 5 7600',
            'AMD Ryzen 7 7800X3D', 'RTX 4060', 'RTX 4070', 'RTX 4070 Super',
            'RTX 4080', 'RX 7600', 'RX 7800 XT', 'DDR5 16GB 6000MHz',
            'DDR5 32GB 6000MHz', 'B650 Motherboard', 'Z790 Motherboard',
            '1TB NVMe SSD', '2TB NVMe SSD', '750W 80+ Gold PSU',
            '850W 80+ Gold PSU', 'ATX Mid Tower Case', '360mm AIO Cooler',
        ]

        products = []
        for i in range(1, 101):
            name = random.choice(product_names)
            price = Decimal(random.randint(299, 15999)) + Decimal('0.99')
            original = price + Decimal(random.randint(100, 2000))

            products.append(Product(
                name=f'{name} #{i}',
                description=f'High quality {name} for gaming and productivity. Product #{i}',
                price=price,
                original_price=original,
                stock_quantity=random.randint(5, 200),
                sku=f'SKU-{1000 + i}',
                weight=round(random.uniform(0.2, 5.0), 2),
                rating=round(random.uniform(3.5, 5.0), 2),
                is_published=True,
                brand=random.choice(brands),
                category=random.choice(categories),
            ))

        Product.objects.bulk_create(products)
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(products)} products'))