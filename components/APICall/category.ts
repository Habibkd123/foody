export const apiCall = async (url: string, method: string, data?: any, isFormData?: boolean) => {
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      
      // Only add body for non-GET/HEAD requests
      if (method !== 'GET' && method !== 'HEAD' && data) {
        options.body = isFormData ? data : JSON.stringify(data);
      }
      
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw error;
    } finally {
    }
  };


  export const getCategories = async (data: any = {}) => {
    // Build query parameters, only including defined values
    const queryParams = new URLSearchParams();
    
    if (data.searchParams) queryParams.append('searchParams', data.searchParams);
    if (data.includeSubcategories) queryParams.append('includeSubcategories', data.includeSubcategories);
    if (data.page) queryParams.append('page', data.page);
    if (data.limit) queryParams.append('limit', data.limit);
    if (data.parent) queryParams.append('parent', data.parent);
    if (data.search) queryParams.append('search', data.search);
    if (data.level) queryParams.append('level', data.level);
    if (data.sort) queryParams.append('sort', data.sort);
    
    const queryString = queryParams.toString();
    const url = `/api/categories${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(url, "GET", undefined, false);
  };

  export const getProductsByNavSearch = async (data: any = {}) => {
    // Build query parameters, only including defined values
    const queryParams = new URLSearchParams();
    
    if (data.searchParams) queryParams.append('searchParams', data.searchParams);
    if (data.page) queryParams.append('page', data.page);
    if (data.limit) queryParams.append('limit', data.limit);
    
    const url = `/api/categories/type?type=${data.type}&page=${data.page}&limit=${data.limit}`;
    
    return apiCall(url, "GET", undefined, false);
  };