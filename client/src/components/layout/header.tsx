import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/lib/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, Bell, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <Link href="/">
            <span className="font-sans font-bold text-xl cursor-pointer">Translinqual</span>
          </Link>
        </div>
        
        {/* Navigation Links - Desktop */}
        {user && (
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <a className={`px-3 py-2 rounded-md font-medium ${location === "/" ? "text-primary" : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"}`}>
                Home
              </a>
            </Link>
            <a href="#" className="px-3 py-2 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Features
            </a>
            <a href="#" className="px-3 py-2 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              About
            </a>
            <a href="#" className="px-3 py-2 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Help
            </a>
          </nav>
        )}
        
        {/* User Controls */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </span>
            </Button>
          )}
          
          {/* User Profile Dropdown or Login Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full flex items-center justify-center"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.username} />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem>
                    <Link href="/admin">
                      <div className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu with animation */}
      <div 
        className={`md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <a 
              className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                location === "/" 
                  ? "text-primary bg-gray-100 dark:bg-gray-800" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </span>
            </a>
          </Link>
          
          <Link href="/chat">
            <a 
              className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                location.startsWith("/chat") 
                  ? "text-primary bg-gray-100 dark:bg-gray-800" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Conversations
              </span>
            </a>
          </Link>
          
          <a 
            href="#" 
            className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Features
            </span>
          </a>
          
          <a 
            href="#" 
            className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              About
            </span>
          </a>
          
          <a 
            href="#" 
            className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              Help
            </span>
          </a>
          
          {user?.role === "admin" && (
            <Link href="/admin">
              <a 
                className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </span>
              </a>
            </Link>
          )}
          
          {user && (
            <a 
              href="#" 
              className="block px-3 py-2 rounded-md text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 mt-2"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              <span className="flex items-center">
                <LogOut className="h-5 w-5 mr-2" />
                Log out
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
