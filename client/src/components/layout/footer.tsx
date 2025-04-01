import { useTheme } from "@/lib/theme-provider";
import { Link } from "wouter";

export function Footer() {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex justify-around">
        <Link href="/">
          <a className="flex flex-col items-center py-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="text-xs mt-1">Chat</span>
          </a>
        </Link>
        <a href="#" className="flex flex-col items-center py-3 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M3 3v18h18"></path>
            <path d="M18.4 9a18 18 0 0 0-5.7-5.3A18 18 0 0 0 7 9a18 18 0 0 0 5.7 5.3A18 18 0 0 0 18.4 9Z"></path>
            <path d="M3 9h18"></path>
          </svg>
          <span className="text-xs mt-1">History</span>
        </a>
        <a href="#" className="flex flex-col items-center py-3 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span className="text-xs mt-1">Learn</span>
        </a>
        <a href="#" className="flex flex-col items-center py-3 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </footer>
  );
}
