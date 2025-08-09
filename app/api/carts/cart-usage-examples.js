// Cart CRUD API Usage Examples

// 1. CREATE CART
const createCart = async () => {
  const cartData = {
    user: "64f1b2c3d4e5f6789a0b1c2d", // User ObjectId
    items: [
      {
        product: "64f1b2c3d4e5f6789a0b1c2e", // Product ObjectId
        quantity: 2
      },
      {
        product: "64f1b2c3d4e5f6789a0b1c2f", // Another Product ObjectId
        quantity: 1
      }
    ]
  };

  const response = await fetch('/api/carts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartData)
  });

  const result = await response.json();
  console.log('Created cart:', result);
};

// 2. GET ALL CARTS (with pagination and filters)
const getAllCarts = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '20',
    hasItems: 'true', // Only carts with items
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    minAmount: '50' // Minimum cart value
  });

  const response = await fetch(`/api/carts?${params}`);
  const result = await response.json();
  console.log('Carts:', result.data.carts);
  console.log('Pagination:', result.data.pagination);
};

// 3. GET CART BY ID
const getCartById = async (cartId) => {
  const response = await fetch(`/api/carts/${cartId}`);
  const result = await response.json();

  if (result.success) {
    console.log('Cart:', result.data);
    console.log('Total Amount:', result.data.totalAmount);
    console.log('Item Count:', result.data.itemCount);
  } else {
    console.error('Error:', result.error);
  }
};

// 4. UPDATE CART
const updateCart = async (cartId) => {
  const updateData = {
    items: [
      {
        product: "64f1b2c3d4e5f6789a0b1c2e",
        quantity: 3 // Update quantity
      },
      {
        product: "64f1b2c3d4e5f6789a0b1c30", // Add new product
        quantity: 1
      }
    ]
  };

  const response = await fetch(`/api/carts/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Updated cart:', result);
};

// 5. DELETE CART
const deleteCart = async (cartId) => {
  const response = await fetch(`/api/carts/${cartId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Delete result:', result);
};

// 6. GET USER'S CART
const getUserCart = async (userId) => {
  const response = await fetch(`/api/carts/user/${userId}`);
  const result = await response.json();

  if (result.success) {
    console.log('User cart:', result.data);
    console.log('Items in cart:', result.data.items.length);
  }
};

// 7. ADD ITEM TO USER'S CART
const addItemToCart = async (userId) => {
  const itemData = {
    productId: "64f1b2c3d4e5f6789a0b1c2e",
    quantity: 2
  };

  const response = await fetch(`/api/carts/user/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData)
  });

  const result = await response.json();
  console.log('Added item to cart:', result);
};

// 8. UPDATE ITEM QUANTITY IN CART
const updateCartItem = async (userId) => {
  const updateData = {
    productId: "64f1b2c3d4e5f6789a0b1c2e",
    quantity: 5 // New quantity
  };

  const response = await fetch(`/api/carts/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Updated cart item:', result);
};

// 9. BULK UPDATE CART ITEMS
const bulkUpdateCart = async (userId) => {
  const bulkData = {
    items: [
      {
        productId: "64f1b2c3d4e5f6789a0b1c2e",
        quantity: 3
      },
      {
        productId: "64f1b2c3d4e5f6789a0b1c2f",
        quantity: 0 // This will remove the item
      },
      {
        productId: "64f1b2c3d4e5f6789a0b1c30",
        quantity: 2
      }
    ]
  };

  const params = new URLSearchParams({
    action: 'bulk'
  });

  const response = await fetch(`/api/carts/user/${userId}?${params}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bulkData)
  });

  const result = await response.json();
  console.log('Bulk updated cart:', result);
};

// 10. REMOVE SPECIFIC ITEM FROM CART
const removeItemFromCart = async (userId, productId) => {
  const params = new URLSearchParams({
    productId: productId
  });

  const response = await fetch(`/api/carts/user/${userId}?${params}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Removed item from cart:', result);
};

// 11. CLEAR ENTIRE CART
const clearUserCart = async (userId) => {
  const response = await fetch(`/api/carts/user/${userId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Cleared cart:', result);
};

// 12. GET CART STATISTICS
const getCartStats = async () => {
  const params = new URLSearchParams({
    // startDate: "2024-01-01T00:00:00.000Z", // Optional
    // endDate: "2024-12-31T23:59:59.999Z"     // Optional
  });

  const response = await fetch(`/api/carts/stats?${params}`);
  const result = await response.json();
  console.log('Cart statistics:', result.data);
  console.log('Top products in carts:', result.data.topProducts);
};

// 13. GET DETAILED CART ANALYTICS
const getCartAnalytics = async () => {
  const analyticsData = {
    groupBy: 'day', // 'day', 'week', 'month', 'hour'
    period: 30, // Last 30 days
    metrics: ['carts', 'value', 'items']
  };

  const response = await fetch('/api/carts/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(analyticsData)
  });

  const result = await response.json();
  console.log('Cart analytics:', result.data);
};

// 14. SHOPPING CART COMPONENT (React example)
const ShoppingCartComponent = ({ userId }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const response = await fetch(`/api/carts/user/${userId}`);
      const result = await response.json();

      if (result.success) {
        setCart(result.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(`/api/carts/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity })
      });

      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const params = new URLSearchParams({ productId });
      const response = await fetch(`/api/carts/user/${userId}?${params}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCart(); // Reload cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadCart();
    }
  }, [userId]);

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cart && cart.items.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.images[0]} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>Price: ${item.product.price}</p>
                  <p>Subtotal: ${item.subtotal}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(item.product._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {cart.itemCount}</p>
            <p>Total Amount: ${cart.totalAmount}</p>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      )}
    </div>
  );
};

// 15. ADD TO CART FUNCTIONALITY
const addToCartHandler = async (userId, productId, quantity = 1) => {
  try {
    const response = await fetch(`/api/carts/user/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Item added to cart successfully');
      // Update UI to reflect cart change
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert(error.message);
  }
};

// 16. CART PERSISTENCE (Local Storage Backup)
const CartPersistence = {
  saveCart: (cart) => {
    try {
      localStorage.setItem('cart_backup', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  loadCart: () => {
    try {
      const saved = localStorage.getItem('cart_backup');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return null;
    }
  },

  clearCart: () => {
    try {
      localStorage.removeItem('cart_backup');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
};

// 17. CART VALIDATION
const validateCartItem = (item) => {
  const errors = [];

  if (!item.productId || !/^[0-9a-fA-F]{24}$/.test(item.productId)) {
    errors.push('Invalid product ID');
  }

  if (!item.quantity || item.quantity < 1 || item.quantity > 100) {
    errors.push('Quantity must be between 1 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 18. ERROR HANDLING EXAMPLE
const handleCartApiCall = async (apiFunction) => {
  try {
    await apiFunction();
  } catch (error) {
    console.error('Cart API call failed:', error);

    if (error.message.includes('Product unavailable')) {
      alert('This product is currently out of stock or unavailable');
    } else if (error.message.includes('Cart not found')) {
      alert('Cart not found. Creating a new cart...');
    } else if (error.message.includes('already exists')) {
      alert('This item is already in your cart');
    } else {
      alert('An error occurred while processing your cart');
    }
  }
};

// Usage with error handling
handleCartApiCall(() => addItemToCart(userId));
handleCartApiCall(() => updateCartItem(userId));
handleCartApiCall(() => removeItemFromCart(userId));

const addToCart = {
  productId: "64f1b2c3d4e5f6789a0b1c2e",
  quantity: 2
};

await fetch(`/api/carts/user/${userId}`, {
  method: 'POST',
  body: JSON.stringify(addToCart)
});

const bulkUpdate = {
  items: [
    { productId: "product1", quantity: 3 },
    { productId: "product2", quantity: 0 }, // Remove item
    { productId: "product3", quantity: 1 }
  ]
};


// # Main Cart Management
// GET /api/carts                           # All carts with pagination
// POST /api/carts                          # Create cart

// GET /api/carts/[id]                      # Get cart by ID
// PUT /api/carts/[id]                      # Update cart
// DELETE /api/carts/[id]                   # Delete cart

// # User-specific Cart Operations
// GET /api/carts/user/[userId]             # Get/create user cart
// POST /api/carts/user/[userId]            # Add item to cart
// PUT /api/carts/user/[userId]             # Update item/bulk update
// DELETE /api/carts/user/[userId]          # Clear cart/remove item

// # Analytics & Statistics
// GET /api/carts/stats                     # Cart statistics
// POST /api/carts/stats                    # Detailed analytics
