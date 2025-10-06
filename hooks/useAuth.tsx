"use client";
import { useEffect, useState } from "react";

type AuthResult = {
  data?: { token?: string };
  user?: any;
};

export function useAuthStorage(result?: AuthResult) {

  const [token, setToken] = useState<string | null>("");
const [loacaluser,setLocalUser]=useState<any>(  {})
 
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(window.localStorage.getItem("G-user") || "{}");
      } catch {
        return {};
      }
    }
    return {};
  });

 

  const getData= async()=>{
    const result = await fetch("/api/auth/set-cookies",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    })
    const data = await result.json();
    if(data.success){
      setToken(data.token);
      setLocalUser(data.user)
      window.localStorage.setItem("token", data.token);
    }
   
  }
  const getUserData= async()=>{
    if(loacaluser._id){
    const result = await fetch(`/api/users/${loacaluser._id}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    })
    const data = await result.json();
    if(data.success){
      setUser(data.data);
    }
   }
  }
useEffect(()=>{
  getData()

},[])
useEffect(() => {
  if (loacaluser && loacaluser._id) {
    getUserData();
  }
}, [loacaluser]); 

  return { token, user, setToken, setUser };
}
