from django.db import transaction
from django.db.models import F
from django.utils import timezone

def cancel_pending_order(order) -> bool:
    with transaction.atomic():
        order = (
            type(order).objects.select_for_update()
            .prefetch_related("order_items")
            .get(pk=order.pk)
        )
        if order.order_status != order.OrderStatus.PENDING:
            return False

        order.release_order_stock()
        
        order.order_status = order.OrderStatus.EXPIRED
        if hasattr(order, "payment_session_id"):
            order.payment_session_id = None
        if hasattr(order, "payment_session_expires_at"):
            order.payment_session_expires_at = None
        order.save()
        return True
        