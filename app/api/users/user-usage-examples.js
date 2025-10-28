// User CRUD API Usage Examples

// 1. CREATE USER
const createUser = async () => {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: 1234567890,
    password: "securePassword123",
    role: "user", // Optional: defaults to 'user'
    addresses: [
      {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA"
      }
    ]
  };

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });

  const result = await response.json();
  console.log('Created user:', result);
};

// 2. GET ALL USERS (with pagination and filters)
const getAllUsers = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '20',
    role: 'user', // Optional: filter by role
    search: 'john', // Optional: search users
    sortBy: 'firstName',
    sortOrder: 'asc',
    hasAddresses: 'true' // Optional: filter users with addresses
  });

  const response = await fetch(`/api/users?${params}`);
  const result = await response.json();
  console.log('Users:', result.data.users);
  console.log('Pagination:', result.data.pagination);
};

// 3. GET USER BY ID
const getUserById = async (userId) => {
  const params = new URLSearchParams({
    includePrivate: 'true' // Include email, phone, addresses
  });

  const response = await fetch(`/api/users/${userId}?${params}`);
  const result = await response.json();

  if (result.success) {
    console.log('User:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};

// 4. UPDATE USER
const updateUser = async (userId) => {
  const updateData = {
    firstName: "John Updated",
    lastName: "Doe Updated",
    phone: 9876543210,
    // password: "newSecurePassword123" // Optional: update password
  };

  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();
  console.log('Updated user:', result);
};

// 5. DELETE USER
const deleteUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Delete result:', result);
};

// 6. USER LOGIN
const loginUser = async () => {
  const loginData = {
    action: 'login', // Specify the action
    email: "john.doe@example.com",
    password: "securePassword123"
  };

  const response = await fetch('/api/users/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData)
  });

  const result = await response.json();
  console.log('Login result:', result);

  if (result.success) {
    console.log('Logged in user:', result.data.user);
    // Store token if available: localStorage.setItem('token', result.data.token);
  }
};

// 7. CHANGE PASSWORD
const changePassword = async (userId) => {
  const passwordData = {
    action: 'changePassword',
    userId: userId,
    currentPassword: "securePassword123",
    newPassword: "newSecurePassword456",
    confirmPassword: "newSecurePassword456"
  };

  const response = await fetch('/api/users/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData)
  });

  const result = await response.json();
  console.log('Password change result:', result);
};

// 8. SEARCH USERS (Simple search)
const searchUsers = async (query) => {
  const params = new URLSearchParams({
    q: query,
    limit: '10',
    role: 'user', // Optional: filter by role
    includePrivate: 'false' // Get only public info
  });

  const response = await fetch(`/api/users/search?${params}`);
  const result = await response.json();
  console.log('Search results:', result.data.results);
};

// 9. ADVANCED USER SEARCH
const advancedSearchUsers = async () => {
  const searchData = {
    query: "john",
    filters: {
      role: "user",
      hasAddresses: true,
      createdAfter: "2024-01-01T00:00:00.000Z",
      createdBefore: "2024-12-31T23:59:59.999Z"
    },
    sort: { firstName: 1, lastName: 1 },
    limit: 50,
    includePrivate: false
  };

  const response = await fetch('/api/users/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData)
  });

  const result = await response.json();
  console.log('Advanced search results:', result.data);
};

// 10. GET USER ADDRESSES
const getUserAddresses = async (userId) => {
  const response = await fetch(`/api/users/${userId}/addresses`);
  const result = await response.json();

  if (result.success) {
    console.log('User addresses:', result.data.addresses);
  }
};

// 11. ADD NEW ADDRESS
const addUserAddress = async (userId) => {
  const newAddress = {
    street: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90210",
    country: "USA"
  };

  const response = await fetch(`/api/users/${userId}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAddress)
  });

  const result = await response.json();
  console.log('Added address:', result);
};

// 12. UPDATE ADDRESS
const updateUserAddress = async (userId, addressId) => {
  const updatedAddress = {
    street: "456 Oak Avenue Updated",
    city: "Los Angeles",
    state: "CA"
  };

  const params = new URLSearchParams({
    addressId: addressId
  });

  const response = await fetch(`/api/users/${userId}/addresses?${params}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAddress)
  });

  const result = await response.json();
  console.log('Updated address:', result);
};

// 13. DELETE ADDRESS
const deleteUserAddress = async (userId, addressId) => {
  const params = new URLSearchParams({
    addressId: addressId
  });

  const response = await fetch(`/api/users/${userId}/addresses?${params}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  console.log('Delete address result:', result);
};

// 14. GET USER STATISTICS
const getUserStats = async () => {
  const params = new URLSearchParams({
    // startDate: "2024-01-01T00:00:00.000Z", // Optional
    // endDate: "2024-12-31T23:59:59.999Z"     // Optional
  });

  const response = await fetch(`/api/users/stats?${params}`);
  const result = await response.json();
  console.log('User statistics:', result.data);
};

// 15. GET DETAILED ANALYTICS
const getUserAnalytics = async () => {
  const analyticsData = {
    groupBy: 'day', // 'day', 'week', 'month', 'hour'
    period: 30, // Last 30 days
    metrics: ['registrations', 'addresses']
  };

  const response = await fetch('/api/users/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(analyticsData)
  });

  const result = await response.json();
  console.log('User analytics:', result.data);
};

// 16. CREATE ADMIN USER
const createAdminUser = async () => {
  const adminData = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: 5555555555,
    password: "adminSecurePassword123",
    role: "admin",
    username: "admin001"
  };

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData)
  });

  const result = await response.json();
  console.log('Created admin:', result);
};

// 17. VALIDATE USER DATA BEFORE SUBMISSION
const validateUserData = (userData) => {
  const errors = [];

  if (!userData.firstName || userData.firstName.length < 1) {
    errors.push('First name is required');
  }

  if (!userData.lastName || userData.lastName.length < 1) {
    errors.push('Last name is required');
  }

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Valid email is required');
  }

  if (!userData.phone || userData.phone.toString().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 18. USER MANAGEMENT COMPONENT (React example)
const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/users?${params}`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="user-management">
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <div className="users-list">
            {users.map(user => (
              <div key={user?._id} className="user-card">
                <h3>{user?.fullName}</h3>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
                <p>Addresses: {user?.addresses.length}</p>
                <p>Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => loadUsers(pagination.current - 1)}
              disabled={pagination.current <= 1}
            >
              Previous
            </button>

            <span>
              Page {pagination.current} of {pagination.pages}
            </span>

            <button 
              onClick={() => loadUsers(pagination.current + 1)}
              disabled={pagination.current >= pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 19. ERROR HANDLING EXAMPLE
const handleUserApiCall = async (apiFunction) => {
  try {
    await apiFunction();
  } catch (error) {
    console.error('User API call failed:', error);

    if (error.message.includes('already exists')) {
      alert('User with this email or phone number already exists');
    } else if (error.message.includes('Invalid credentials')) {
      alert('Email or password is incorrect');
    } else if (error.message.includes('not found')) {
      alert('User not found');
    } else {
      alert('An error occurred while processing your request');
    }
  }
};

// Usage with error handling
handleUserApiCall(() => createUser());
handleUserApiCall(() => loginUser());
handleUserApiCall(() => getUser());
handleUserApiCall(() => updateUser());
handleUserApiCall(() => deleteUser());

const newAddress = {
  street: "123 Main St",
  city: "New York",
  state: "NY", 
  postalCode: "10001",
  country: "USA"
};

// # User Management
// GET /api/users                           # All users with pagination
// POST /api/users                          # Create user

// GET /api/users/[id]                      # Get user by ID
// PUT /api/users/[id]                      # Update user
// DELETE /api/users/[id]                   # Delete user

// # Authentication
// POST /api/users/auth                     # Login & password change
// GET /api/users/auth                      # Token verification

// # Address Management  
// GET /api/users/[userId]/addresses        # Get user addresses
// POST /api/users/[userId]/addresses       # Add address
// PUT /api/users/[userId]/addresses        # Update address
// DELETE /api/users/[userId]/addresses     # Delete address

// # Search & Analytics
// GET /api/users/search                    # Simple search
// POST /api/users/search                   # Advanced search
// GET /api/users/stats                     # User statistics
// POST /api/users/stats                    # Detailed analytics
