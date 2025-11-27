"use client";
import React from "react";
import Link from "next/link";
import { Menu, Heart, ShoppingCart, Search } from "lucide-react";

type Action = {
  key: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  badgeCount?: number;
};

interface AppHeaderProps {
  logoSrc?: string;
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  actions?: Action[];
  sticky?: boolean;
  withBlur?: boolean;
  border?: boolean;
  className?: string;
  containerClassName?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  initialSearch?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  logoSrc = "/logoGro.png",
  title = "Gro-Delivery",
  subtitle,
  onMenuClick,
  actions = [],
  sticky = true,
  withBlur = true,
  border = true,
  className = "",
  containerClassName = "",
  showSearch = false,
  searchPlaceholder = "Search products...",
  onSearch,
  initialSearch = "",
}) => {
  const [query, setQuery] = React.useState(initialSearch);

  const WrapperTag = sticky ? "div" : ("div" as const);

  return (
    <WrapperTag
      className={[
        sticky ? "sticky top-0 z-50" : "",
        withBlur ? "backdrop-blur-md" : "",
        "bg-background/90",
        border ? "border-b border-border" : "",
        "shadow-soft",
        className,
      ].join(" ")}
    >
      <header className="transition-all duration-300">
        <div className={[
          "max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3",
          containerClassName,
        ].join(" ")}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Menu + Logo/Title */}
            <div className="flex items-center gap-3 min-w-0">
              {onMenuClick && (
                <button
                  aria-label="Open Menu"
                  onClick={onMenuClick}
                  className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Menu className="w-5 h-5 text-foreground" />
                </button>
              )}

              <div className="flex items-center gap-2 min-w-0">
                {logoSrc && (
                  // Using img for consistency with existing codebase
                  <img
                    src={logoSrc}
                    alt="Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-md"
                  />
                )}
                <div className="truncate">
                  <div className="text-lg sm:text-xl font-extrabold text-foreground leading-tight truncate">
                    {title}
                  </div>
                  {subtitle && (
                    <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Search (optional) */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-2xl items-center">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && onSearch) onSearch(query.trim());
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {actions.map((action) => {
                const content = (
                  <div className="relative">
                    <div className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                      {action.icon}
                      {action.label && (
                        <span className="ml-2 hidden sm:inline text-sm text-foreground font-medium">
                          {action.label}
                        </span>
                      )}
                    </div>
                    {typeof action.badgeCount === "number" && action.badgeCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] leading-none px-1.5 py-1 rounded-full font-semibold">
                        {action.badgeCount}
                      </span>
                    )}
                  </div>
                );

                if (action.href) {
                  return (
                    <Link key={action.key} href={action.href} className="group">
                      {content}
                    </Link>
                  );
                }
                return (
                  <button key={action.key} onClick={action.onClick} className="group">
                    {content}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile search */}
          {showSearch && (
            <div className="mt-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && onSearch) onSearch(query.trim());
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </WrapperTag>
  );
};

export default AppHeader;
