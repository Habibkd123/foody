
// "use client"
// import React, { createContext, useContext, useState, ReactNode } from "react";

// type Address = {
//   id: string;
//   name: string;
//   phone: string;
//   pincode: string;
//   city: string;
//   state: string;
//   landmark?: string;
//   addressLine: string;
//   isDefault?: boolean;
// };

// type AddressContextType = {
//   addresses: Address[];
//   defaultAddress: Address | null;
//   addAddress: (address: Address) => void;
//   removeAddress: (id: string) => void;
//   setDefaultAddress: (id: string) => void;
//   distance:number;
//   setDistance:(distance:number)=>void
// };

// const AddressContext = createContext<AddressContextType | undefined>(undefined);

// export const AddressProvider = ({ children }: { children: ReactNode }) => {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [defaultAddress, setDefault] = useState<Address | null>(null);
//   const [distance,setDistance]=useState<number>(0)
//   const addAddress = (address: Address) => {
//     setAddresses((prev) => [...prev, address]);
//     if (addresses.length === 0) {
//       setDefault(address); // first added address = default
//     }
//   };

//   const removeAddress = (id: string) => {
//     setAddresses((prev) => prev.filter((addr) => addr.id !== id));
//     if (defaultAddress?.id === id) {
//       setDefault(addresses[0] || null);
//     }
//   };

//   const setDefaultAddress = (id: string) => {
//     const addr = addresses.find((a) => a.id === id) || null;
//     setDefault(addr);
//   };

//   return (
//     <AddressContext.Provider
//       value={{ addresses, defaultAddress, addAddress, removeAddress, setDefaultAddress,distance,setDistance }}
//     >
//       {children}
//     </AddressContext.Provider>
//   );
// };

// export const useAddress = () => {
//   const context = useContext(AddressContext);
//   if (!context) {
//     throw new Error("useAddress must be used within an AddressProvider");
//   }
//   return context;
// };



"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Address = {
  _id?: string;
  id?: string;
  name: string;
  phone: string | number;
  pincode?: string;
  zipCode?: string;
  city: string;
  state: string;
  landmark?: string;
  addressLine?: string;
  area?: string;
  street?: string;
  flatNumber?: string;
  floor?: string;
  label: string; // Home, Work, Hotel, Other
  lat?: number;
  lng?: number;
  isDefault?: boolean;
};

type AddressContextType = {
  addresses: Address[];
  defaultAddress: Address | null;
  loading: boolean;
  error: string | null;
  distance: number;
  
  // CRUD Operations
  addAddress: (userId: string, address: Omit<Address, '_id' | 'id'>) => Promise<void>;
  updateAddress: (userId: string, addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (userId: string, addressId: string) => Promise<void>;
  loadAddresses: (userId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => void;
  setDistance: (distance: number) => void;
  clearError: () => void;
};

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefault] = useState<Address | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function for API calls
  const apiCall = async (url: string, options: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: { 
          'Content-Type': 'application/json', 
          ...options.headers 
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load all addresses for a user
  const loadAddresses = useCallback(async (userId: string) => {
    try {
      const data = await apiCall(`/api/users/${userId}/addresses`, { method: 'GET' });
      
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        
        // Set default address (first one marked as default or first in list)
        const defaultAddr = data.addresses.find((addr: Address) => addr.isDefault) || data.addresses[0];
        if (defaultAddr) {
          setDefault(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  }, []);

  // Add new address
  const addAddress = useCallback(async (userId: string, address: Omit<Address, '_id' | 'id'>) => {
    try {
      // If this is the first address, make it default
      const isFirstAddress = addresses.length === 0;
      const addressToAdd = {
        ...address,
        isDefault: isFirstAddress || address.isDefault
      };

      const data = await apiCall(`/api/users/${userId}/addresses`, {
        method: 'POST',
        body: JSON.stringify(addressToAdd),
      });

      if (data.success && data.address) {
        const newAddress = data.address;
        
        setAddresses(prev => {
          // If new address is default, update others
          if (newAddress.isDefault) {
            return [newAddress, ...prev.map(addr => ({ ...addr, isDefault: false }))];
          }
          return [...prev, newAddress];
        });

        // Update default address if needed
        if (newAddress.isDefault || isFirstAddress) {
          setDefault(newAddress);
        }
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    }
  }, [addresses.length]);

  // Update existing address
  const updateAddress = useCallback(async (userId: string, addressId: string, addressUpdates: Partial<Address>) => {
    try {
      const data = await apiCall(`/api/users/${userId}/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressUpdates),
      });

      if (data.success && data.address) {
        const updatedAddress = data.address;
        
        setAddresses(prev => {
          const updated = prev.map(addr => {
            if ((addr._id || addr.id) === addressId) {
              return updatedAddress;
            }
            // If updated address is now default, remove default from others
            if (updatedAddress.isDefault && addr.isDefault) {
              return { ...addr, isDefault: false };
            }
            return addr;
          });
          return updated;
        });

        // Update default address if needed
        if (updatedAddress.isDefault) {
          setDefault(updatedAddress);
        } else if (defaultAddress && (defaultAddress._id || defaultAddress.id) === addressId && !updatedAddress.isDefault) {
          // If default address was updated to not be default, find new default
          const newDefault = addresses.find(addr => addr.isDefault && (addr._id || addr.id) !== addressId);
          setDefault(newDefault || null);
        }
      }
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    }
  }, [addresses, defaultAddress]);

  // Delete address
  const deleteAddress = useCallback(async (userId: string, addressId: string) => {
    try {
      await apiCall(`/api/users/${userId}/addresses/${addressId}`, { method: 'DELETE' });
      
      setAddresses(prev => {
        const filtered = prev.filter(addr => (addr._id || addr.id) !== addressId);
        
        // If we deleted the default address, set a new default
        const wasDefault = defaultAddress && (defaultAddress._id || defaultAddress.id) === addressId;
        if (wasDefault && filtered.length > 0) {
          const newDefault = filtered[0];
          newDefault.isDefault = true;
          setDefault(newDefault);
          
          // Update the default address on server
          updateAddress(userId, newDefault._id || newDefault.id!, { isDefault: true });
        } else if (wasDefault) {
          setDefault(null);
        }
        
        return filtered;
      });
      
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    }
  }, [defaultAddress, updateAddress]);

  // Set default address (local only, call updateAddress to persist)
  const setDefaultAddress = useCallback((addressId: string) => {
    const addr = addresses.find(a => (a._id || a.id) === addressId);
    if (addr) {
      setDefault(addr);
      setAddresses(prev => 
        prev.map(a => ({
          ...a,
          isDefault: (a._id || a.id) === addressId
        }))
      );
    }
  }, [addresses]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AddressContextType = {
    addresses,
    defaultAddress,
    loading,
    error,
    distance,
    addAddress,
    updateAddress,
    deleteAddress,
    loadAddresses,
    setDefaultAddress,
    setDistance,
    clearError
  };

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};