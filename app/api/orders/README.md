# Orders API Documentation

This document describes the complete CRUD API for managing orders in the Foody application.

## Base URL
All endpoints are prefixed with `/api/orders`

## Endpoints

### 1. Get All Orders
**GET** `/api/orders`

Fetch all orders with pagination, filtering, and sorting capabilities.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by order status (pending, paid, shipped, delivered, canceled)
- `userId` (string, optional): Filter by user ID
- `sortBy` (string, optional): Field to sort by (default: createdAt)
- `sortOrder` (string, optional): Sort direction - asc or desc (default: desc)

**Example:**
```
GET /api/orders?page=1&limit=20&status=pending&sortBy=total&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalOrders": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Create New Order
**POST** `/api/orders`

Create a new order.

**Request Body:**
```json
{
  "user": "ObjectId",
  "items": [
    {
      "product": "ObjectId",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "paymentId": "pi_1234567890",
  "orderId": "ORD-2024-001",
  "method": "card",
  "delivery": "ObjectId" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* populated order object */ }
}
```

### 3. Get Single Order
**GET** `/api/orders/[id]`

Fetch a single order by ID with full population.

**Response:**
```json
{
  "success": true,
  "data": { /* populated order object */ }
}
```

### 4. Update Order
**PUT** `/api/orders/[id]`

Update an existing order. Only provided fields will be updated.

**Request Body (all fields optional):**
```json
{
  "status": "shipped",
  "items": [...],
  "total": 65.50,
  "paymentId": "pi_new_payment",
  "delivery": "ObjectId",
  "method": "upi"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated order object */ },
  "message": "Order updated successfully"
}
```

### 5. Delete Order
**DELETE** `/api/orders/[id]`

Delete an order. Cannot delete shipped or delivered orders.

**Response:**
```json
{
  "success": true,
  "message": "Order deleted successfully",
  "deletedOrderId": "ObjectId"
}
```

### 6. Order Statistics
**GET** `/api/orders/stats`

Get comprehensive order statistics and analytics.

**Query Parameters:**
- `userId` (string, optional): Filter stats by user
- `startDate` (string, optional): Start date for date range
- `endDate` (string, optional): End date for date range

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalOrders": 150,
      "totalRevenue": 15000.50,
      "averageOrderValue": 100.00,
      "pendingOrders": 10,
      "paidOrders": 80,
      "shippedOrders": 40,
      "deliveredOrders": 15,
      "canceledOrders": 5
    },
    "ordersByStatus": [...],
    "ordersByMethod": [...],
    "dailyTrends": [...]
  }
}
```

### 7. Bulk Operations
**POST** `/api/orders/bulk`

Perform bulk operations on multiple orders.

**Request Body:**
```json
{
  "operation": "update_status", // or "delete", "update_payment_method", "assign_delivery"
  "orderIds": ["ObjectId1", "ObjectId2", "ObjectId3"],
  "updateData": {
    "status": "shipped" // depends on operation
  }
}
```

**Supported Operations:**
- `update_status`: Update status for multiple orders
- `delete`: Delete multiple orders (cannot delete shipped/delivered)
- `update_payment_method`: Update payment method for multiple orders
- `assign_delivery`: Assign delivery to multiple orders

### 8. Get Multiple Orders
**GET** `/api/orders/bulk?ids=id1,id2,id3`

Fetch multiple orders by their IDs.

**Query Parameters:**
- `ids` (string, required): Comma-separated list of order IDs

### 9. Advanced Search
**POST** `/api/orders/search`

Advanced search with complex filtering and aggregation.

**Request Body:**
```json
{
  "query": "search text", // optional - searches across orderId, paymentId, user fields
  "filters": {
    "status": "pending",
    "userId": "ObjectId",
    "paymentMethod": "card",
    "minTotal": 50,
    "maxTotal": 500,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "hasDelivery": true
  },
  "sort": { "createdAt": -1 }, // optional
  "page": 1, // optional
  "limit": 20, // optional
  "populate": true // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { /* pagination info */ },
  "aggregation": {
    "totalValue": 5000.00,
    "averageValue": 125.00,
    "statusCounts": {
      "pending": 10,
      "paid": 25,
      "shipped": 5
    }
  },
  "searchQuery": "search text",
  "appliedFilters": { /* applied filters */ }
}
```

## Order Status Values
- `pending`: Order created but not paid
- `paid`: Payment successful
- `shipped`: Order dispatched
- `delivered`: Order delivered to customer
- `canceled`: Order canceled

## Payment Methods
- `card`: Credit/Debit card payment
- `upi`: UPI payment

## Error Responses
All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information" // optional
}
```

## Common HTTP Status Codes
- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## Population
Most endpoints automatically populate related fields:
- `user`: firstName, lastName, email, phone, addresses
- `items.product`: name, price, image, category, description, stock
- `delivery`: address, status, estimatedDelivery, trackingNumber

## Authentication
Make sure to implement proper authentication middleware before using these endpoints in production.

## Rate Limiting
Consider implementing rate limiting for bulk operations and search endpoints to prevent abuse.
