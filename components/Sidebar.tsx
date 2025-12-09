
// "use client";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation"; // ✅ Import for current URL
// import Link from "next/link";
// import { ChevronDown, ChevronRight, Shield, BarChart3, CheckSquare, Users, DollarSign, Bell } from "lucide-react";
// import { useSidebar } from "@/context/SidebarContext";

// const NavigationItem = ({ item, activeTab, setActiveTab, expandedMenus, toggleMenu, isCollapsed, currentPath }: any) => {
//   const isActive = currentPath?.startsWith(item.href) || activeTab === item.id;
//   return (
//     <Link href={item.href}>
//       <button
//         aria-current={isActive ? 'page' : undefined}
//         className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"}
//           ${isActive
//             ? "bg-orange-100 text-orange-700 border border-orange-200 ring-1 ring-orange-200"
//             : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-80 hover:opacity-100"}
//         `}
//         onClick={() => {
//           setActiveTab(item.id);
//           if (item.subItems && !isCollapsed) {
//             toggleMenu(item.id);
//           }
//         }}
//         title={isCollapsed ? item.label : ""}
//       >
//         {!isCollapsed && isActive && (
//           <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 rounded-r" />
//         )}
//         <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
//           <item.icon className="h-5 w-5" />
//           {!isCollapsed && <span className="font-medium">{item.label}</span>}
//         </div>
//       </button>
//     </Link>
//   );
// };

// const Sidebar = () => {
//   const { isExpanded, isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
//   const pathname = usePathname(); // ✅ get current URL path
//   const [activeTab, setActiveTab] = useState("");
//   const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

//   // ✅ Set activeTab based on current URL
//   useEffect(() => {
//     const currentItem = navigationItems.find((item) =>
//       pathname.startsWith(item.href.replace("#", ""))
//     );
//     if (currentItem) {
//       setActiveTab(currentItem.id);
//     }
//   }, [pathname]);

//   const toggleMenu = (menuId: string) => {
//     setExpandedMenus((prev) => ({
//       ...prev,
//       [menuId]: !prev[menuId],
//     }));
//   };

//   const navigationItems = [
//     { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/admin" },

//     {
//       id: "categories",
//       label: "Categories",
//       icon: CheckSquare,
//       href: "/admin/categories",

//     },
//     {
//       id: "products",
//       label: "Products",
//       icon: CheckSquare,
//       href: "/admin/products",

//     },
//     {
//       id: "banner",
//       label: "Banner",
//       icon: CheckSquare,
//       href: "/admin/banner",

//     },
//     {
//       id: "orders",
//       label: "Orders",
//       icon: CheckSquare,
//       href: "/admin/orders",

//     },
//     {
//       id: "users",
//       label: "Users",
//       icon: Users,
//       href: "/admin/users",

//     },
//     {
//       id: "notifications",
//       label: "Notifications",
//       icon: Bell,
//       href: "/admin/notifications",

//     },
//     { id: "sales", label: "Sales", icon: DollarSign, href: "/admin/sales" },
//   ];

//   return (
//     <>
//       {isMobile && isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       <div
//         className={`
//           fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 
//           border-r border-gray-200 dark:border-gray-800 flex flex-col z-50
//           transition-all duration-300 ease-in-out transform
//           ${isMobile
//             ? isMobileOpen
//               ? "translate-x-0 w-64"
//               : "-translate-x-full w-64"
//             : isExpanded
//               ? "w-64"
//               : "w-16"}
//         `}
//       >
//         {/* Header */}
//         <div className={`flex items-center p-6 border-b border-gray-200 dark:border-gray-700 ${!isExpanded ? 'justify-center' : 'justify-start'}`}>
//           <Shield className="h-8 w-8 text-blue-500" />
//           {isExpanded && <span className="text-lg font-bold">Admin Panel</span>}
//         </div>

//         {/* Navigation */}
//         <nav className={`flex-1 py-4 space-y-2 overflow-y-auto ${!isExpanded ? "px-2" : "px-4"}`}>
//           {navigationItems.map((item) => (
//             <NavigationItem
//               key={item.id}
//               item={item}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               expandedMenus={expandedMenus}
//               toggleMenu={toggleMenu}
//               isCollapsed={!isExpanded}
//               currentPath={pathname}
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
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  BarChart3,
  CheckSquare,
  Users,
  DollarSign,
  Bell,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/admin" },
  { id: "categories", label: "Categories", icon: CheckSquare, href: "/admin/categories" },
  { id: "products", label: "Products", icon: CheckSquare, href: "/admin/products" },
  { id: "banner", label: "Banner", icon: CheckSquare, href: "/admin/banner" },
  { id: "orders", label: "Orders", icon: CheckSquare, href: "/admin/orders" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { id: "sales", label: "Sales", icon: DollarSign, href: "/admin/sales" },
];

type NavigationItemProps = {
  item: NavItem;
  isCollapsed: boolean;
  currentPath: string;
  onClick?: () => void;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isCollapsed,
  currentPath,
  onClick,
}) => {
  const isActive =
    item.href === "/admin"
      ? currentPath === "/admin" || currentPath.startsWith("/admin")
      : currentPath.startsWith(item.href);

  return (
    <Link href={item.href} onClick={onClick}>
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${
          isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"
        } ${
          isActive
            ? "bg-orange-100 text-orange-700 border border-orange-200 ring-1 ring-orange-200"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-80 hover:opacity-100"
        }`}
        title={isCollapsed ? item.label : ""}
      >
        {!isCollapsed && isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 rounded-r" />
        )}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
        </div>
      </button>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { isExpanded, isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const isCollapsed = !isExpanded && !isMobile;

  // close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      closeMobileSidebar();
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 lg:top-0
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col z-50
          transition-all duration-300 ease-in-out transform
          ${isMobile ? "h-screen" : "h-screen lg:h-screen"} 
          ${isMobile
            ? isMobileOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : isExpanded
            ? "w-64"
            : "w-16"}
        `}
      >
        {/* Sidebar header (align with your main header height if needed) */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <Shield className="h-7 w-7 text-blue-500" />
          {isExpanded && (
            <span className="ml-2 text-sm font-semibold truncate">
              Admin Panel
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 py-4 space-y-2 overflow-y-auto ${
            isExpanded ? "px-3" : "px-2"
          }`}
        >
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              currentPath={pathname}
              onClick={() => {
                if (isMobile) closeMobileSidebar();
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
