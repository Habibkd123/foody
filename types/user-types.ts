export interface UserCreateRequest {
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  password: string;
  role?: 'user' | 'admin';
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

export interface UserUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: number;
  password?: string;
  role?: 'user' | 'admin';
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

export interface UserResponse {
  _id: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: number;
  role: 'user' | 'admin';
  addresses: Array<{
    _id?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublicResponse {
  _id: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserListResponse {
  users: UserResponse[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

export interface UserStatsResponse {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersWithAddresses: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserPublicResponse;
  token?: string;
  message: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddressRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}