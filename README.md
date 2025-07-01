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

# Nimble.Glow-API – Best Practice Endpoints

## 1. Authentication

| Endpoint                     | Method | Description                        | Authentication      | Body / Query                                         |
|------------------------------|--------|------------------------------------|---------------------|------------------------------------------------------|
| `/api/auth/login`            | POST   | User login                         | -                   | `{ email, password }`                                |
| `/api/auth/register`         | POST   | Register new customer              | -                   | `{ email, firstName, lastName, mobile, password }`   |
| `/api/auth/admin/register`   | POST   | Register admin (by superadmin)     | Superadmin          | `{ email, firstName, lastName, mobile, password }`   |
| `/api/auth/me`               | GET    | Get current user (profile)         | -                   | (JWT in header)                                      |
| `/api/auth/logout`           | POST   | Logout (optional, for session)     | -                   | (JWT in header)                                      |

## 2. Category

| Endpoint                     | Method | Description                | Authentication      | Body / Query      |
|------------------------------|--------|----------------------------|---------------------|-------------------|
| `/api/categories`            | GET    | List all categories        | -                   | -                 |
| `/api/categories`            | POST   | Create new category        | Admin/Superadmin    | `{ name }`        |
| `/api/categories/:id`        | PUT    | Update category            | Admin/Superadmin    | `{ name }`        |
| `/api/categories/:id`        | DELETE | Delete category            | Admin/Superadmin    | -                 |

## 3. Product

| Endpoint                     | Method | Description                | Authentication      | Body / Query                              |
|------------------------------|--------|----------------------------|---------------------|-------------------------------------------|
| `/api/products`              | GET    | List/search products       | -                   | (query: keyword, category, price...)      |
| `/api/products`              | POST   | Create product             | Admin/Superadmin    | `{ title, description, ... }`             |
| `/api/products/:id`          | GET    | Get product by id          | -                   | -                                         |
| `/api/products/:id`          | PUT    | Update product             | Admin/Superadmin    | `{ title, description, ... }`             |
| `/api/products/:id`          | DELETE | Delete product             | Admin/Superadmin    | -                                         |

## 4. User Management

| Endpoint                     | Method | Description                    | Authentication      | Body / Query          |
|------------------------------|--------|--------------------------------|---------------------|-----------------------|
| `/api/users`                 | GET    | List users (all)               | Admin/Superadmin    | -                     |
| `/api/users/:id`             | GET    | Get user by id                 | Admin/Superadmin    | -                     |
| `/api/users/:id`             | PATCH  | Update user (role/status)      | Superadmin          | `{ role, enabled }`   |
| `/api/users/:id`             | DELETE | Delete customer                | Superadmin          | -                     |

## 5. Cart & Order

| Endpoint                         | Method | Description                    | Authentication  | Body / Query                         |
|----------------------------------|--------|--------------------------------|-----------------|--------------------------------------|
| `/api/cart`                      | GET    | Get user's cart                | customer        | -                                    |
| `/api/cart`                      | POST   | Add/update item in cart        | customer        | `{ productId, count }`               |
| `/api/cart/items/:itemId`        | DELETE | Remove item from cart          | customer        | -                                    |
| `/api/orders`                    | POST   | Create order from cart         | customer        | `{ addressId, note, couponCode }`    |
| `/api/orders`                    | GET    | Get current user's orders      | customer        | -                                    |
| `/api/orders/:id`                | GET    | Get order by id                | -               | -                                    |
| `/api/orders/:id/status`         | PATCH  | Update order status            |Admin/Superadmin | `{ orderStatus }`                    |

## 6. Payment

| Endpoint                               | Method | Description                | Authentication      | Body / Query                |
|----------------------------------------|--------|----------------------------|---------------------|-----------------------------|
| `/api/payments/methods`                | GET    | List payment methods       | -                   | -                           |
| `/api/orders/:orderId/pay`             | POST   | Pay for order              | customer            | `{ paymentMethod, amount }` |
| `/api/orders/:orderId/payment`         | GET    | Get payment for order      | -                   | -                           |
| `/api/payments/:id/refund`             | POST   | Refund payment             | Admin/Superadmin    | `{ reason, amount }`        |
| `/api/payments/webhook`                | POST   | Payment gateway webhook    | Gateway             | `{ ... }`                   |

## 7. Shipping

| Endpoint                                   | Method | Description                    | Authentication      | Body / Query                              |
|--------------------------------------------|--------|--------------------------------|---------------------|-------------------------------------------|
| `/api/shipping/methods`                    | GET    | List shipping methods          | -                   | -                                         |
| `/api/shipping/methods`                    | POST   | Add shipping method            | Admin/Superadmin    | `{ ... }`                                 |
| `/api/shipping/methods/:id`                | PUT    | Update shipping method         | Admin/Superadmin    | `{ ... }`                                 |
| `/api/shipping/methods/:id`                | DELETE | Delete shipping method         | Admin/Superadmin    | -                                         |
| `/api/orders/:orderId/shipping`            | GET    | Get order shipping status      | -                   | -                                         |
| `/api/orders/:orderId/shipping`            | PATCH  | Update order shipping status   | Admin/Superadmin    | `{ status, trackingNumber, shippedAt }`   |
| `/api/shipping/webhook`                    | POST   | Shipping gateway webhook       | Shipping Provider   | `{ ... }`                                 |

## 8. Review & Rating

| Endpoint                                    | Method | Description                    | Authentication  | Body / Query                    |
|---------------------------------------------|--------|--------------------------------|-----------------|---------------------------------|
| `/api/reviews`                              | POST   | Create review                  | customer        | `{ productId, rating, comment }`|
| `/api/reviews/product/:productId`           | GET    | Get reviews for a product      | -               | -                               |
| `/api/reviews/user/:userId`                 | GET    | Get user's reviews             | -               | -                               |
| `/api/reviews/:id`                          | PATCH  | Update review                  | customer        | `{ rating, comment }`           |
| `/api/reviews/:id`                          | DELETE | Delete review                  | customer        | -                               |

## 9. Promotion / Coupon

| Endpoint                  | Method | Description                | Authentication  | Body / Query    |
|---------------------------|--------|----------------------------|-----------------|-----------------|
| `/api/coupons/apply`      | POST   | Apply coupon to order/cart | customer        | `{ code }`      |
| `/api/coupons`            | GET    | List available coupons     | -               | -               |

## 10. Shipping Refund (optional)

| Endpoint                  | Method | Description                | Authentication  | Body / Query    |
|---------------------------|--------|----------------------------|-----------------|-----------------|
| `/api/shipping/rate`      | GET    | Query shipping rate/refund | customer        | (query param)   |

---



