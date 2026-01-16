"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Utensils,
  BarChart3,
  PlusCircle,
  ShoppingCart,
  Store,
  Boxes,
  LineChart,
  AlertCircle,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/restaurant" },
  { id: "food", label: "Add Food", icon: PlusCircle, href: "/restaurant/food" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/restaurant/orders" },
  { id: "disputes", label: "Disputes", icon: AlertCircle, href: "/restaurant/disputes" },
  { id: "inventory", label: "Inventory", icon: Boxes, href: "/restaurant/inventory" },
  { id: "analytics", label: "Analytics", icon: LineChart, href: "/restaurant/analytics" },
];

type NavigationItemProps = {
  item: NavItem;
  isCollapsed: boolean;
  currentPath: string;
  onClick?: () => void;
  badgeCount?: number;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isCollapsed,
  currentPath,
  onClick,
  badgeCount,
}) => {
  const isActive =
    item.href === "/restaurant"
      ? currentPath === item.href
      : currentPath.startsWith(item.href);

  return (
    <Link href={item.href} onClick={onClick}>
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"
          } ${isActive
            ? "bg-green-100 text-green-700 border border-green-200 ring-1 ring-green-200"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-80 hover:opacity-100"
          }`}
        title={isCollapsed ? item.label : ""}
      >
        {!isCollapsed && isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r" />
        )}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"
            }`}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
        </div>
        {!isCollapsed && typeof badgeCount === 'number' && badgeCount > 0 && (
          <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold">
            {badgeCount}
          </span>
        )}
      </button>
    </Link>
  );
};

const RestaurantSidebar: React.FC = () => {
  const { isExpanded, isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const isCollapsed = !isExpanded && !isMobile;

  // close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      closeMobileSidebar();
    }
  }, [pathname]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const res = await fetch('/api/restaurant/orders?status=pending', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!json?.success) {
          return;
        }
        if (!ignore) {
          setPendingOrdersCount(Array.isArray(json.data) ? json.data.length : 0);
        }
      } catch {
        // ignore
      }
    };

    load();
    const t = setInterval(load, 20000);
    return () => {
      ignore = true;
      clearInterval(t);
    };
  }, []);

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
        {/* Sidebar header */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 ${isExpanded ? "justify-start" : "justify-center"
            }`}
        >
          <Utensils className="h-7 w-7 text-green-500" />
          {isExpanded && (
            <span className="ml-2 text-sm font-semibold truncate">
              Restaurant Panel
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 py-4 space-y-2 overflow-y-auto ${isExpanded ? "px-3" : "px-2"
            }`}
        >
          <NavigationItem
            item={{ id: 'profile', label: 'Profile', icon: Store, href: '/restaurant/profile' }}
            isCollapsed={isCollapsed}
            currentPath={pathname}
            onClick={() => {
              if (isMobile) closeMobileSidebar();
            }}
          />
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              currentPath={pathname}
              badgeCount={item.id === 'orders' ? pendingOrdersCount : undefined}
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

export default RestaurantSidebar;
