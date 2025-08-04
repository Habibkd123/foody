"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from './ui/button'
import { WishListContext } from '@/context/WishListsContext'
import { Trash2 } from 'lucide-react'

const Profile = () => {
  const [userData, setUserData] = useState<any>(null)
  const { wishListsData, setWistListsData } = React.useContext<any>(WishListContext);


  const handleRemove = (id: number) => {
    setWistListsData(wishListsData.filter((item: any) => item.id !== id))
  };
  console.log("wishListsData,", wishListsData);
  const foodItems = [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken",
      price: 320,
      image: "https://images.unsplash.com/photo-1714799263303-29e7d638578a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnV0dGVyJTIwQ2hpY2tlbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      isVeg: false,
      restaurant: "Spice Garden",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with aromatic spices",
      price: 280,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UGFuZWVyJTIwVGlra2F8ZW58MHx8MHx8fDA%3D",
      isVeg: true,
      restaurant: "Spice Garden",
    },
    {
      id: 3,
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables and sauces",
      price: 220,
      image: "https://media.istockphoto.com/id/1159004213/photo/schezwan-noodles-with-vegetables-in-a-plate-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=1urIQ80xe_34IwgSMNhg4FJAYYGc53-38yT47NnLlEE=",
      isVeg: true,
      restaurant: "Dragon Palace",
    },
    {
      id: 4,
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella and basil",
      price: 380,
      image: "https://media.istockphoto.com/id/1414575281/photo/a-delicious-and-tasty-italian-pizza-margherita-with-tomatoes-and-buffalo-mozzarella.webp?a=1&b=1&s=612x612&w=0&k=20&c=qO_TA5oZTY4d1e14l6noMYmAB26sSoE8L0m_VYl2bcU=",
      isVeg: true,
      restaurant: "Pasta Corner",
    },
  ]


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("G-user")
      if (storedUser) {
        setUserData(JSON.parse(storedUser))
      }
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem("G-user")
    localStorage.removeItem("token")
    window.location.reload()

  }
  return (
    <section id="profile" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Your Profile</h2>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <Avatar className="w-20 h-20">
                        {userData?.image ? (
                          <AvatarImage src={userData.image} alt={userData?.firstName || "User"} />
                        ) : (
                          <AvatarFallback className="bg-orange-500 text-white fw-bold ">
                            {userData?.firstName ? userData.firstName.charAt(0).toUpperCase() + " " + userData.lastName.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{userData?.firstName + " " + userData?.lastName}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{userData?.email}</p>
                      <p className="text-gray-600 dark:text-gray-400"> {userData?.phone}</p>
                    </div>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 me-2">Edit Profile</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleLogout}>Logout</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <Card key={order}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Order #{order}001</h4>
                          <p className="text-gray-600 dark:text-gray-400">Spice Garden • 2 items</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Dec {20 + order}, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">₹{320 + order * 50}</p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
                {wishListsData && wishListsData.length === 0 ? (
                  <p className="text-gray-600 text-center">Your wishlist is empty 😢</p>
                ) : wishListsData && wishListsData.map((item: any) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-orange-500 font-semibold">₹{item.price}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </CardContent>
                  </Card>
              </div>
                ))}
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Home</h4>
                        <p className="text-gray-600 dark:text-gray-400">123 Main Street, City, State 12345</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Add New Address</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default Profile
