import { Header } from "@/components/layout/header";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Auth Form */}
            <div className="flex justify-center">
              <AuthForm />
            </div>
            
            {/* Hero Section */}
            <div className="hidden md:block">
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-center">Welcome to TransLingual</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Join our multilingual AI chat platform to explore and learn Kenyan languages including Maasai, Kiswahili, Kikuyu, and more.
                </p>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold mb-3">Features you'll unlock:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>AI-powered chat in multiple Kenyan languages</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Voice input and text-to-speech capabilities</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Document and image translation</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Saved conversation history</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Cultural context alongside translations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
