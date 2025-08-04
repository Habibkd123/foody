// src/context/AddressContext.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Address = {
  flatNumber: string;
  floor: string;
  area: string;
  landmark: string;
  name: string;
  phone: string;
};

type AddressContextType = {
  address: Address;
  setAddress: (data: Partial<Address>) => void;
  distance:number;
  setDistance:(distance:number)=>void
};

const defaultAddress: Address = {
  flatNumber: '',
  floor: '',
  area: '',
  landmark: '',
  name: '',
  phone: ''
};

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddressState] = useState<Address>(defaultAddress);
  const [distance,setDistance]=useState<number>(0)

  const setAddress = (data: Partial<Address>) => {
    setAddressState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <AddressContext.Provider value={{ address, setAddress,distance,setDistance }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = (): AddressContextType => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
};

export default AddressContext;