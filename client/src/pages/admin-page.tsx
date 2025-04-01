import { Header } from "@/components/layout/header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not admin
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AdminDashboard />
      </main>
    </div>
  );
}
