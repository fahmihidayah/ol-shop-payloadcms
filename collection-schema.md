This is online shop platform. The collection are :
{
  "users": {
    "id": "UUID",
    "name": "string",
    "email": "string (unique)",
    "password_hash": "string",
    "phone": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },

  "categories": {
    "id": "UUID",
    "name": "string",
    "slug": "string (unique)",
    "parent_id": "UUID (nullable)",
    "created_at": "timestamp"
  },

  "products": {
    "id": "UUID",
    "title": "string",
    "description": "text",
    "slug": "string (unique)",
    "thumbnail_url": "string",
    "category_id": "UUID (FK → categories.id)",
    "is_active": "boolean",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },

  "product_variants": {
    "id": "UUID",
    "product_id": "UUID (FK → products.id)",
    "sku": "string (unique)",
    "title": "string",
    "price": "decimal(10,2)",
    "old_price": "decimal(10,2, nullable)",
    "cost": "decimal(10,2, nullable)",
    "stock_quantity": "integer",
    "weight": "decimal(10,2, nullable)",
    "image_url": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },

  "variant_options": {
    "id": "UUID",
    "variant_id": "UUID (FK → product_variants.id)",
    "name": "string",
    "value": "string"
  },

  "carts": {
    "id": "UUID",
    "user_id": "UUID (nullable, FK → users.id)",
    "session_id": "string (nullable, unique)",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },

  "cart_items": {
    "id": "UUID",
    "cart_id": "UUID (FK → carts.id)",
    "variant_id": "UUID (FK → product_variants.id)",
    "quantity": "integer",
    "price": "decimal(10,2)",
    "subtotal": "decimal(10,2)",
    "created_at": "timestamp"
  },

  "orders": {
    "id": "UUID",
    "order_number": "string (unique)",
    "user_id": "UUID (nullable, FK → users.id)",
    "guest_name": "string (nullable)",
    "guest_email": "string (nullable)",
    "guest_phone": "string (nullable)",
    "shipping_address": "text",
    "payment_status": "enum('pending', 'paid', 'failed', 'refunded')",
    "total_amount": "decimal(10,2)",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },

  "order_items": {
    "id": "UUID",
    "order_id": "UUID (FK → orders.id)",
    "variant_id": "UUID (FK → product_variants.id)",
    "quantity": "integer",
    "price": "decimal(10,2)",
    "subtotal": "decimal(10,2)",
    "created_at": "timestamp"
  },

  "payments": {
    "id": "UUID",
    "order_id": "UUID (FK → orders.id)",
    "method": "string",
    "transaction_id": "string",
    "status": "enum('pending', 'success', 'failed')",
    "amount": "decimal(10,2)",
    "created_at": "timestamp"
  },

  "addresses": {
    "id": "UUID",
    "user_id": "UUID (FK → users.id)",
    "label": "string",
    "recipient_name": "string",
    "phone": "string",
    "address_line1": "string",
    "address_line2": "string (nullable)",
    "city": "string",
    "province": "string",
    "postal_code": "string",
    "is_default": "boolean",
    "created_at": "timestamp"
  }
}
