from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from orders.models import Order
from orders.services import cancel_pending_order

class Command(BaseCommand):
    help="Cancel PENDING orders older than N hours and release stock"
    
    def add_arguments(self, parser):
        parser.add_argument(
            "--hours",
            type=int,
            default=24,
            help="Cancel PENDING orders older than this many hours (default: 24)"
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Only print, do not cancel"
        )
    
    def handle(self, *args, **options):
        hours = options["hours"]
        dry_run = options["dry_run"]
        cutoff = timezone.now() - timedelta(hours=hours)
        
        qs = Order.objects.filter(
            order_status = Order.OrderStatus.PENDING,
            created_datetime__lt=cutoff
        ).order_by("id")
        
        total = qs.count()
        self.stdout.write(f"Found {total} PENDING order(s) older than {hours}h")
        
        cancelled = 0
        for order in qs:
            if dry_run:
                self.stdout.write(f"[dry-run] would cancel order #{order.id}")
                continue
            if cancel_pending_order(order):
                cancelled += 1
                self.stdout.write(self.style.SUCCESS(f"Cancelled order #{order.id}"))
            else:
                self.stdout.write(f"Skip order #{order.id} (status changed)")
        
        self.stdout.write(self.style.SUCCESS(f"Done. Cancelled {cancelled}/{total}"))
        