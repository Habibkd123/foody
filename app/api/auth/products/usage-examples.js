// Product CRUD API Usage Examples

// 1. CREATE PRODUCT
const createProduct = async () => {
  const productData = {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip",
    images: [
      "https://example.com/iphone15pro-1.jpg",
      "https://example.com/iphone15pro-2.jpg"
    ],
    price: 999.99,
    category: "64f1b2c3d4e5f6789a0b1c2d", // Category ObjectId
    stock: 50,
    status: "active"
  };

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData)
  });

  const result = await response.json();
  console.log('Created product:', result);
};

// 2. GET ALL PRODUCTS (with pagination and filters)
const getAllProducts = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '10',
    status: 'active',
    search: 'iPhone'
  });

  const response = await fetch(`/api/products?${params}`);
  const result = await response.json();
  console.log('Products:', result.data.products);
  console.log('Pagination:', result.data.pagination);
};

// 3. GET PRODUCT BY ID
const getProductById = async (productId) => {
  const response = await fetch(`/api/products/${productId}`);
  const result = await response.json();

  if (result.success) {
    console.log('Product:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};

// 4. UPDATE PRODUCT
const updateProduct = async (productId) => {
  const updateData = {
    price: 899.99,
    stock: 25,
    status: 'inactive'
  };

  const response = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Updated product:', result);
};

// 5. DELETE PRODUCT
const deleteProduct = async (productId) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Delete result:', result);
};

// 6. SEARCH PRODUCTS (Simple search)
const searchProducts = async (query) => {
  const params = new URLSearchParams({
    q: query,
    limit: '5'
  });

  const response = await fetch(`/api/products/search?${params}`);
  const result = await response.json();
  console.log('Search results:', result.data);
};

// 7. ADVANCED SEARCH (with filters)
const advancedSearch = async () => {
  const searchData = {
    query: "phone",
    filters: {
      status: "active",
      minPrice: 500,
      maxPrice: 1500,
      inStock: true
    },
    sort: { price: 1 }, // Sort by price ascending
    limit: 20
  };

  const response = await fetch('/api/products/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData)
  });

  const result = await response.json();
  console.log('Advanced search results:', result.data);
};

// 8. BULK CREATE PRODUCTS
const bulkCreateProducts = async () => {
  const products = [
    {
      name: "Product 1",
      description: "Description 1",
      images: ["https://example.com/img1.jpg"],
      price: 100,
      category: "64f1b2c3d4e5f6789a0b1c2d",
      stock: 10
    },
    {
      name: "Product 2",
      description: "Description 2",
      images: ["https://example.com/img2.jpg"],
      price: 200,
      category: "64f1b2c3d4e5f6789a0b1c2e",
      stock: 20
    }
  ];

  const response = await fetch('/api/products/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products)
  });

  const result = await response.json();
  console.log('Bulk create result:', result);
};

// 9. BULK UPDATE PRODUCTS
const bulkUpdateProducts = async () => {
  const updates = [
    {
      _id: "64f1b2c3d4e5f6789a0b1c2f",
      price: 150,
      stock: 15
    },
    {
      _id: "64f1b2c3d4e5f6789a0b1c30",
      status: "inactive"
    }
  ];

  const response = await fetch('/api/products/bulk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });

  const result = await response.json();
  console.log('Bulk update result:', result);
};

// 10. BULK DELETE PRODUCTS
const bulkDeleteProducts = async () => {
  const productIds = [
    "64f1b2c3d4e5f6789a0b1c2f",
    "64f1b2c3d4e5f6789a0b1c30"
  ];

  const response = await fetch('/api/products/bulk', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productIds)
  });

  const result = await response.json();
  console.log('Bulk delete result:', result);
};

// Error handling example
const handleApiCall = async (apiFunction) => {
  try {
    await apiFunction();
  } catch (error) {
    console.error('API call failed:', error);
  }
};

// Usage with error handling
handleApiCall(() => createProduct());
handleApiCall(() => updateProduct('64f1b2c3d4e5f6789a0b1c2d'));
handleApiCall(() => deleteProduct('64f1b2c3d4e5f6789a0b1c2d'));
handleApiCall(() => searchProducts('phone'));
handleApiCall(() => advancedSearch());
handleApiCall(() => bulkCreateProducts());
handleApiCall(() => bulkUpdateProducts());
handleApiCall(() => bulkDeleteProducts());