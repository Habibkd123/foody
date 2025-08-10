// "use client";
// import React, { useState, useEffect } from 'react';
// import {
//   User,
//   CheckSquare,
//   Map,
//   Clock,
//   UserCheck,
//   ArrowRight,
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Sun,
//   Moon,
//   LogOut,
//   BarChart3,
//   Users,
//   MapPin,
//   DollarSign,
//   Shield
// } from 'lucide-react';
// import { useSidebar } from '@/context/SidebarContext';
// import Link from 'next/link';
// const NavigationItem = ({ item, activeTab, setActiveTab, expandedMenus, toggleMenu, isCollapsed }: any) => (
//   <Link href={item.href}>
//     <button
//       className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${
//         isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
//       } ${
//         activeTab === item.id
//           ? 'bg-orange-50 text-orange-600 shadow-sm'
//           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//       }`}
//       onClick={() => {
//         setActiveTab(item.id);
//         if (item.subItems && !isCollapsed) {
//           toggleMenu(item.id);
//         }
//       }}
//       title={isCollapsed ? item.label : ''}
//     >
//       <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
//         <item.icon className={`h-5 w-5 transition-transform duration-200 ${isCollapsed ? 'flex-shrink-0' : ''}`} />
//         {!isCollapsed && (
//           <span className="font-medium">{item.label}</span>
//         )}
//       </div>

//       {/* Tooltip for collapsed state */}
//       {isCollapsed && (
//         <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
//           {item.label}
//         </div>
//       )}

//       {item.subItems && !isCollapsed && (
//         <div className="transition-transform duration-200">
//           {expandedMenus[item.id] ? (
//             <ChevronDown className="h-4 w-4" />
//           ) : (
//             <ChevronRight className="h-4 w-4" />
//           )}
//         </div>
//       )}
//     </button>

//     {/* Show subitems only when not collapsed */}
//     {item.subItems && expandedMenus[item.id] && !isCollapsed && (
//       <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
//         {item.subItems.map((subItem: any, index: any) => (
//           <Link href={subItem.href} key={index}>
//           <button
//             key={index}
//             className="w-full text-left text-sm px-4 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:translate-x-1"
//           >
//             {subItem.name}
//           </button>
//           </Link>
//         ))}
//       </div>
//     )}
//   </  Link>
// );
// const Sidebar = () => {
//   const { isExpanded, isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});

//   const toggleMenu = (menuId: string) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuId]: !prev[menuId]
//     }));
//   };

// const navigationItems = [
//   { 
//     id: 'dashboard', 
//     label: 'Dashboard', 
//     icon: BarChart3,
//     href: '/admin/dashboard'
//   },
//   {
//     id: 'ecommerce',
//     label: 'E-Commerce',
//     icon: CheckSquare,
//     href: '/admin/#',
//     subItems: [
//       { name: 'Categories', href: '/admin/categories' },
//       { name: 'Products', href: '/admin/products' },
//       { name: 'Orders', href: '/admin/orders' }
//     ]
//   },
//   {
//     id: 'users',
//     label: 'Users',
//     icon: Users,
//     href: '/admin/users',
//     subItems: [
//       { name: 'All Users', href: '/admin/users/all' },
//       { name: 'Wallet Management', href: '/admin/users/wallet' }
//     ]
//   },
//   { id: 'sales', label: 'Sales', icon: DollarSign, href: '/admin/sales' }
// ];
//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobile && isMobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       <div
//         className={`
//           ${isMobile ? 'fixed' : 'fixed'} top-0 left-0 h-screen bg-white dark:bg-gray-900 
//           border-r border-gray-200 dark:border-gray-800 flex flex-col z-50
//           transition-all duration-300 ease-in-out transform
//           ${isMobile 
//             ? (isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64')
//             : (isExpanded ? 'w-64' : 'w-16')
//           }
//         `}
//       >
//         {/* Header */}
//         <div className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 ${!isExpanded && !isMobile ? 'justify-center' : 'justify-between'}`}>
//           {!isExpanded && !isMobile ? (
//             <div className="w-15 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Shield className="h-8 w-8 text-white" />
//             </div>
//           ) : (
//             <div className="flex items-center space-x-2">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Shield className="h-8 w-8 text-white" />
//               </div>
//               <span className="text-lg font-bold text-gray-900 dark:text-white">
//                 Admin Panel
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav className={`flex-1 py-4 space-y-2 overflow-y-auto ${!isExpanded && !isMobile ? 'px-2' : 'px-4'}`}>
//           {navigationItems.map((item) => (
//             <NavigationItem
//               key={item.id}
//               item={item}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               expandedMenus={expandedMenus}
//               toggleMenu={toggleMenu}
//               isCollapsed={!isExpanded && !isMobile}
//             />
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // ✅ Import for current URL
import Link from "next/link";
import { ChevronDown, ChevronRight, Shield, BarChart3, CheckSquare, Users, DollarSign } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const NavigationItem = ({ item, activeTab, setActiveTab, expandedMenus, toggleMenu, isCollapsed }: any) => (
  <Link href={item.href}>
    <button
      className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"
        } ${activeTab === item.id
          ? "bg-orange-50 text-orange-600 shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      onClick={() => {
        setActiveTab(item.id);
        if (item.subItems && !isCollapsed) {
          toggleMenu(item.id);
        }
      }}
      title={isCollapsed ? item.label : ""}
    >
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
        <item.icon className="h-5 w-5" />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </div>

     
    </button>
  </Link>
);

const Sidebar = () => {
  const { isExpanded, isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
  const pathname = usePathname(); // ✅ get current URL path
  const [activeTab, setActiveTab] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  // ✅ Set activeTab based on current URL
  useEffect(() => {
    const currentItem = navigationItems.find((item) =>
      pathname.startsWith(item.href.replace("#", ""))
    );
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [pathname]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/admin" },

    {
      id: "categories",
      label: "Categories",
      icon: CheckSquare,
      href: "/admin/categories",

    },
    {
      id: "products",
      label: "Products",
      icon: CheckSquare,
      href: "/admin/products",

    },
    {
      id: "orders",
      label: "Orders",
      icon: CheckSquare,
      href: "/admin/orders",

    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/admin/users",

    },
    { id: "sales", label: "Sales", icon: DollarSign, href: "/admin/sales" },
  ];

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 flex flex-col z-50
          transition-all duration-300 ease-in-out transform
          ${isMobile
            ? isMobileOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : isExpanded
              ? "w-64"
              : "w-16"}
        `}
      >
        {/* Header */}
        <div className={`flex items-center p-6 border-b border-gray-200 dark:border-gray-700 ${!isExpanded ? 'justify-center' : 'justify-start'}`}>
          <Shield className="h-8 w-8 text-blue-500" />
          {isExpanded && <span className="text-lg font-bold">Admin Panel</span>}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-2 overflow-y-auto ${!isExpanded ? "px-2" : "px-4"}`}>
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              isCollapsed={!isExpanded}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
