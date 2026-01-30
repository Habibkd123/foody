
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useUserStore } from '@/lib/store/useUserStore';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';


const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

// User Dropdown
const UserDropdown = () => {
  const { logout, user } = useUserStore();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
            {/* <AvatarImage src="/avatars/01.png" alt={user?.name} /> */}
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Helper to get page details
const getPageDetails = (pathname: string) => {
  if (pathname.includes('/admin/products')) return {
    title: 'Products',
    description: 'Manage your product inventory, pricing, and availability.'
  };
  if (pathname.includes('/admin/categories')) return {
    title: 'Categories',
    description: 'Organize your products into categories and subcategories.'
  };
  if (pathname.includes('/admin/orders')) return {
    title: 'Orders Overview',
    description: 'Track and manage customer orders and delivery status.'
  };
  if (pathname.includes('/admin/users')) return {
    title: 'Users',
    description: 'Manage customers, restaurants, and administrative users.'
  };

  // Specific driver routes first
  if (pathname.includes('/admin/drivers/analytics')) return {
    title: 'Driver Analytics',
    description: 'Performance metrics and earnings for drivers.'
  };
  if (pathname.includes('/admin/drivers/tracking')) return {
    title: 'Fleet Tracking',
    description: 'Real-time tracking of your delivery fleet.'
  };
  if (pathname.includes('/admin/drivers')) return {
    title: 'Drivers',
    description: 'Monitor fleet performance, verify drivers, and track deliveries.'
  };

  if (pathname.includes('/admin/sales')) return {
    title: 'Sales',
    description: 'Analyze revenue, trends, and sales performance.'
  };
  if (pathname.includes('/admin/banner')) return {
    title: 'Banner',
    description: 'Manage homepage banners and promotional content.'
  };
  if (pathname.includes('/admin/disputes')) return {
    title: 'Disputes',
    description: 'Resolve order issues and customer complaints.'
  };
  if (pathname.includes('/admin/restaurants')) return {
    title: 'Restaurant Approval',
    description: 'Review and approve new restaurant partners.'
  };
  if (pathname.includes('/admin/food-approval')) return {
    title: 'Food Approval',
    description: 'Verify and approve menu items from restaurants.'
  };
  if (pathname.includes('/admin/reviews')) return {
    title: 'Customer Reviews',
    description: 'Monitor feedback and ratings from customers.'
  };
  if (pathname.includes('/admin/notifications')) return {
    title: 'Notifications',
    description: 'Manage system-wide notifications and alerts.'
  };

  return {
    title: 'Dashboard',
    description: 'Overview of your key metrics and recent activities.'
  };
};

// Header Component
const Header = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { title, description } = getPageDetails(pathname);

  return (
    <header className="sticky top-0 flex w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900/80 transition-all duration-200">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggleButton />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;