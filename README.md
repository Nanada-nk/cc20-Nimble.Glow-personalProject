#Nimble.Glow-API
---
### env guide
PORT=9090  
DATABASE_URL=**  
JWT_SECRET=**  

CLOUDINARY_NAME=**  
CLOUDINARY_API_KEY=**  
CLOUDINARY_API_SECRET=**  

---

# Nimble.Glow-API – Endpoints

## 1. Authentication

| Endpoint                     | Method | Description                        | Authentication      | req.body                                             | req.query           | req.params          |
|------------------------------|--------|------------------------------------|---------------------|------------------------------------------------------|---------------------|---------------------|
| `/api/auth/login`            | POST   | User login                         | Public              | `{ email, password }`                                | -                   | -                   |
| `/api/auth/register`         | POST   | Register new customer              | Public              | `{ firstName, lastName, mobile, email, password }`   | -                   | -                   |
| `/api/auth/admin/register`   | POST   | Register admin (by superadmin)     | Superadmin          | `{ email, firstName, lastName, mobile, password }`   | -                   | -                   |
| `/api/auth/me`               | GET    | Get current user (profile)         | User                | `(JWT in header)`                                    | -                   | -                   |
| `/api/auth/logout`           | POST   | Logout (optional, for session)     | User                | `(JWT in header)`                                    | -                   | -                   |

## 2. Category

| Endpoint                     | Method | Description                | Authentication      | req.body          | req.query                                 | req.params          |
|------------------------------|--------|----------------------------|---------------------|-------------------|-------------------------------------------|---------------------|
| `/api/categories`            | GET    | List all categories        | Public              | -                 | `{ name?, page?, limit? }`                | -                   |
| `/api/categories`            | POST   | Create new category        | Admin/Superadmin    | `{ name }`        | -                                         | -                   |         
| `/api/categories/:id`        | PATCH  | Update category            | Admin/Superadmin    | `{ name }`        | -                                         | `{ id }`            |
| `/api/categories/:id`        | DELETE | Delete category            | Admin/Superadmin    | -                 | -                                         | `{ id }`            |

## 3. Product

| Endpoint                     | Method | Description                | Authentication      | req.body                                                                       | req.query                                                       | req.params          |
|------------------------------|--------|----------------------------|---------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------|---------------------|
| `/api/products`              | GET    | List/search products       | Public              | -                                                                              | `{ categoryId?, minPrice?, maxPrice?, search?, page?, limit? }` | -                   |
| `/api/products`              | POST   | Create product             | Admin/Superadmin    | `{ title, description, price, stockQuantity, categoryId, images: [url, ...] }` | -                                                               | -                   |
| `/api/products/:id`          | GET    | Get product by id          | Public              | -                                                                              | -                                                               | `{ id }`            |
| `/api/products/:id`          | PATCH  | Update product             | Admin/Superadmin    | `{ title?, description?, price?, stockQuantity?, categoryId?, images? }`       | -                                                               | `{ id }`            |
| `/api/products/:id`          | DELETE | Delete product             | Admin/Superadmin    | -                                                                              | -                                                               | `{ id }`            |

## 4. User Management

| Endpoint                     | Method | Description                    | Authentication      | req.body              | req.query                | req.params                  |
|------------------------------|--------|--------------------------------|---------------------|-----------------------|--------------------------|-----------------------------|
| `/api/users`                 | GET    | List users (all)               | Admin/Superadmin    | -                     | `{ page?, limit? }`      | -                           |
| `/api/users/:id`             | GET    | Get user by id                 | Admin/Superadmin    | -                     | -                        | `{ id } → userId (Int @id)` |
| `/api/users/:id`             | PATCH  | Update user (role/status)      | Superadmin          | `{ role?, enabled? }` | -                        | `{ id }`                    |
| `/api/users/:id`             | DELETE | Delete customer                | Superadmin          | -                     | -                        | `{ id }`                    |

## 5. Cart & Order

| Endpoint                         | Method | Description                    | Authentication  | req.body                             | req.query           | req.params                       |
|----------------------------------|--------|--------------------------------|-----------------|--------------------------------------|---------------------|----------------------------------|
| `/api/cart`                      | GET    | Get user's cart                | customer        | -                                    | -                   | -                                |
| `/api/cart`                      | POST   | Add/update item in cart        | customer        | `{ productId, count }`               | -                   | -                                |
| `/api/cart/items/:itemId`        | DELETE | Remove item from cart          | customer        | -                                    | -                   | `{ itemId } (ProductOnCart @id)` |
| `/api/orders`                    | POST   | Create order from cart         | customer        | `{ cartId, note?, couponId? }`       | -                   | -                                |
| `/api/orders`                    | GET    | Get current user's orders      | customer        | -                                    | `{ page?, limit? }` | -                                |
| `/api/orders/:id`                | GET    | Get order by id                | customer        | -                                    | -                   | `{ id }`                         |
| `/api/orders/:id/status`         | PATCH  | Update order status            |Admin/Superadmin | `{ orderStatus }`                    | -                   | `{ id }`                         |

## 6. Payment

| Endpoint                               | Method | Description                | Authentication      | req.body                                  | req.query   | req.params          |
|----------------------------------------|--------|----------------------------|---------------------|-------------------------------------------|-------------|---------------------|
| `/api/payments/methods`                | GET    | List payment methods       | Public              | -                                         | -           | -                   |
| `/api/orders/:orderId/pay`             | POST   | Pay for order              | customer            | `{ method, amount }`                      | -           | `{ orderId }`       |
| `/api/orders/:orderId/payment`         | GET    | Get payment for order      | customer            | -                                         | -           | `{ orderId }`       |
| `/api/payments/:id/refund`             | POST   | Refund payment             | Admin/Superadmin    |`{ amount, reason } (ใช้กับ PaymentRefund)`  | -           | `{ id }`            |
| `/api/payments/webhook`                | POST   | Payment gateway webhook    | Gateway             | `{ ... } (ตาม payload ของ gateway)`       | -           | -                   |

## 7. Shipping

| Endpoint                                   | Method | Description                    | Authentication      | req.body                                            | req.query    | req.params          |
|--------------------------------------------|--------|--------------------------------|---------------------|-----------------------------------------------------|------------- |---------------------|
| `/api/shipping/methods`                    | GET    | List shipping methods          | Public              | -                                                   | -            | -                   |
| `/api/shipping/methods`                    | POST   | Add shipping method            | Admin/Superadmin    | `{ ... }`                                           | -            | -                   |
| `/api/shipping/methods/:id`                | PATCH  | Update shipping method         | Admin/Superadmin    | `{ ... }`                                           | -            | `{ id }`            |
| `/api/shipping/methods/:id`                | DELETE | Delete shipping method         | Admin/Superadmin    | -                                                   | -            | `{ id }`            |
| `/api/orders/:orderId/shipping`            | GET    | Get order shipping status      | customer            | -                                                   | -            | `{ orderId }`       |
| `/api/orders/:orderId/shipping`            | PATCH  | Update order shipping status   | Admin/Superadmin    | `{ status, trackingNumber, shippedAt, deliveredAt }`| -            | `{ orderId }`       |
| `/api/shipping/rate`                       | GET    | Query shipping rate/refund     | Customer            | `{ method, weight, ... }`                           | -            | -                   |
| `/api/shipping/webhook`                    | POST   | Shipping gateway webhook       | Shipping Provider   | `{ ... }`                                           | -            | -                   |

## 8. Review & Rating

| Endpoint                                    | Method | Description                    | Authentication  | req.body                                            | req.query         | req.params          |
|---------------------------------------------|--------|--------------------------------|-----------------|-----------------------------------------------------|-------------------|---------------------|
| `/api/reviews`                              | POST   | Create review                  | customer        | `{ productId, rating, comment, images: [url, ...] }`| -                 | -                   |
| `/api/reviews/product/:productId`           | GET    | Get reviews for a product      | Public          | -                                                   | `{ page, limit }` | `{ productId }`     |
| `/api/reviews/user/:userId`                 | GET    | Get user's reviews             | customer        | -                                                   | -                 | -                   |
| `/api/reviews/:id`                          | PATCH  | Update review                  | customer        | `{ rating, comment, images }`                       | -                 | `{ id }`            |
| `/api/reviews/:id`                          | DELETE | Delete review                  | customer        | -                                                   | -                 | -                   |

## 9. Promotion / Coupon

| Endpoint                  | Method | Description                | Authentication  | req.body                  | req.query                | req.params          |
|---------------------------|--------|----------------------------|-----------------|---------------------------|--------------------------|---------------------|
| `/api/coupons/apply`      | POST   | Apply coupon to order/cart | customer        | `{ code, orderId/cartId }`| -                        | -                   |
| `/api/coupons`            | GET    | List available coupons     | Public          | -                         |`{ code?, page?, limit? }`| -                   |




---



