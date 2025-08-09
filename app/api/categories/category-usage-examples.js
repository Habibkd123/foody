// Category CRUD API Usage Examples

// 1. CREATE CATEGORY
const createCategory = async () => {
  const categoryData = {
    name: "Electronics",
    parent: null, // Root category
    image: "https://example.com/electronics.jpg"
  };

  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData)
  });

  const result = await response.json();
  console.log('Created category:', result);
};

// 2. CREATE SUBCATEGORY
const createSubcategory = async (parentId) => {
  const subcategoryData = {
    name: "Smartphones",
    parent: parentId, // Parent category ID
    image: "https://example.com/smartphones.jpg"
  };

  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subcategoryData)
  });

  const result = await response.json();
  console.log('Created subcategory:', result);
};

// 3. GET ALL CATEGORIES (with pagination)
const getAllCategories = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '20',
    includeSubcategories: 'true'
  });

  const response = await fetch(`/api/categories?${params}`);
  const result = await response.json();
  console.log('Categories:', result.data.categories);
  console.log('Pagination:', result.data.pagination);
};

// 4. GET ROOT CATEGORIES ONLY
const getRootCategories = async () => {
  const params = new URLSearchParams({
    parent: 'null', // Only root categories
    limit: '50'
  });

  const response = await fetch(`/api/categories?${params}`);
  const result = await response.json();
  console.log('Root categories:', result.data.categories);
};

// 5. GET SUBCATEGORIES OF A SPECIFIC CATEGORY
const getSubcategories = async (parentId) => {
  const params = new URLSearchParams({
    parent: parentId,
    includeSubcategories: 'true'
  });

  const response = await fetch(`/api/categories?${params}`);
  const result = await response.json();
  console.log('Subcategories:', result.data.categories);
};

// 6. GET CATEGORY BY ID (with subcategories)
const getCategoryById = async (categoryId) => {
  const params = new URLSearchParams({
    includeSubcategories: 'true'
  });

  const response = await fetch(`/api/categories/${categoryId}?${params}`);
  const result = await response.json();

  if (result.success) {
    console.log('Category:', result.data);
    console.log('Subcategories:', result.data.subcategories);
  } else {
    console.error('Error:', result.error);
  }
};

// 7. UPDATE CATEGORY
const updateCategory = async (categoryId) => {
  const updateData = {
    name: "Updated Electronics",
    image: "https://example.com/updated-electronics.jpg"
  };

  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Updated category:', result);
};

// 8. MOVE CATEGORY TO DIFFERENT PARENT
const moveCategoryToParent = async (categoryId, newParentId) => {
  const updateData = {
    parent: newParentId // null for root level
  };

  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Moved category:', result);
};

// 9. DELETE CATEGORY (simple delete)
const deleteCategory = async (categoryId) => {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Delete result:', result);
};

// 10. DELETE CATEGORY WITH SUBCATEGORIES (force delete)
const forceDeleteCategory = async (categoryId) => {
  const params = new URLSearchParams({
    force: 'true' // Delete recursively
  });

  const response = await fetch(`/api/categories/${categoryId}?${params}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Force delete result:', result);
};

// 11. GET CATEGORY TREE/HIERARCHY
const getCategoryTree = async () => {
  const params = new URLSearchParams({
    maxLevel: '3' // Maximum depth
  });

  const response = await fetch(`/api/categories/tree?${params}`);
  const result = await response.json();
  console.log('Category tree:', result.data.tree);
};

// 12. GET CATEGORY TREE FROM SPECIFIC PARENT
const getCategoryTreeFromParent = async (parentId) => {
  const params = new URLSearchParams({
    parentId: parentId,
    maxLevel: '2'
  });

  const response = await fetch(`/api/categories/tree?${params}`);
  const result = await response.json();
  console.log('Category subtree:', result.data.tree);
};

// 13. GET CATEGORY PATH/BREADCRUMB
const getCategoryPath = async (categoryId) => {
  const response = await fetch('/api/categories/tree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryId })
  });

  const result = await response.json();
  console.log('Category path:', result.data.path);
  console.log('Category level:', result.data.level);
};

// 14. SEARCH CATEGORIES (simple search)
const searchCategories = async (query) => {
  const params = new URLSearchParams({
    q: query,
    limit: '10',
    includeSubcategories: 'true'
  });

  const response = await fetch(`/api/categories/search?${params}`);
  const result = await response.json();
  console.log('Search results:', result.data.results);
};

// 15. ADVANCED CATEGORY SEARCH
const advancedSearchCategories = async () => {
  const searchData = {
    query: "phone",
    filters: {
      hasImage: true,
      level: 0 // Only root categories
    },
    sort: { name: 1 },
    limit: 20,
    includeSubcategories: true
  };

  const response = await fetch('/api/categories/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData)
  });

  const result = await response.json();
  console.log('Advanced search results:', result.data);
};

// 16. BULK CREATE CATEGORIES
const bulkCreateCategories = async () => {
  const categories = [
    {
      name: "Fashion",
      parent: null,
      image: "https://example.com/fashion.jpg"
    },
    {
      name: "Men's Clothing",
      parent: "64f1b2c3d4e5f6789a0b1c2d", // Fashion category ID
      image: "https://example.com/mens-clothing.jpg"
    },
    {
      name: "Women's Clothing",
      parent: "64f1b2c3d4e5f6789a0b1c2d", // Fashion category ID
      image: "https://example.com/womens-clothing.jpg"
    }
  ];

  const response = await fetch('/api/categories/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categories)
  });

  const result = await response.json();
  console.log('Bulk create result:', result);
};

// 17. BULK UPDATE CATEGORIES
const bulkUpdateCategories = async () => {
  const updates = [
    {
      _id: "64f1b2c3d4e5f6789a0b1c2f",
      name: "Updated Category 1",
      image: "https://example.com/updated1.jpg"
    },
    {
      _id: "64f1b2c3d4e5f6789a0b1c30",
      name: "Updated Category 2"
    }
  ];

  const response = await fetch('/api/categories/bulk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });

  const result = await response.json();
  console.log('Bulk update result:', result);
};

// 18. BULK DELETE CATEGORIES
const bulkDeleteCategories = async () => {
  const deleteData = {
    categoryIds: [
      "64f1b2c3d4e5f6789a0b1c2f",
      "64f1b2c3d4e5f6789a0b1c30"
    ],
    force: true // Delete recursively with subcategories
  };

  const response = await fetch('/api/categories/bulk', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deleteData)
  });

  const result = await response.json();
  console.log('Bulk delete result:', result);
};

// 19. DISPLAY CATEGORY TREE IN UI (React example)
const CategoryTreeComponent = ({ tree }) => {
  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <div key={node._id} style={{ marginLeft: level * 20 }}>
        <div className="category-item">
          {node.image && <img src={node.image} alt={node.name} />}
          <span>{node.name} (Level: {node.level})</span>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="subcategories">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="category-tree">
      {renderTree(tree)}
    </div>
  );
};

// 20. ERROR HANDLING EXAMPLE
const handleCategoryApiCall = async (apiFunction) => {
  try {
    await apiFunction();
  } catch (error) {
    console.error('Category API call failed:', error);

    if (error.message.includes('Circular reference')) {
      alert('Cannot create circular reference in category hierarchy');
    } else if (error.message.includes('already exists')) {
      alert('Category with this name already exists at this level');
    } else {
      alert('An error occurred while processing your request');
    }
  }
};

// Usage with error handling
handleCategoryApiCall(() => createCategory());
handleCategoryApiCall(() => getCategoryTree());
handleCategoryApiCall(() => advancedSearchCategories());
handleCategoryApiCall(() => bulkCreateCategories());
handleCategoryApiCall(() => bulkUpdateCategories());
handleCategoryApiCall(() => bulkDeleteCategories());






// GET /api/categories                    # All categories with pagination
// POST /api/categories                   # Create category

// GET /api/categories/[id]               # Get by ID with subcategories  
// PUT /api/categories/[id]               # Update category
// DELETE /api/categories/[id]            # Delete (with force option)

// GET /api/categories/tree               # Get category hierarchy
// POST /api/categories/tree              # Get category breadcrumb path

// GET /api/categories/search             # Simple search
// POST /api/categories/search            # Advanced search with filters

// POST /api/categories/bulk              # Bulk create
// PUT /api/categories/bulk               # Bulk update
// DELETE /api/categories/bulk            # Bulk delete
