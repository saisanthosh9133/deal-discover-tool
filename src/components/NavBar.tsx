import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut, User, LogIn, MapPin, Megaphone } from "lucide-react";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Promote Link */}
                <Link to="/promote" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Megaphone className="w-4 h-4" />
                    Promote Deal
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/promote" className="cursor-pointer sm:hidden">
                        <Megaphone className="w-4 h-4 mr-2" />
                        Promote Deal
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/locations" className="cursor-pointer">
                          <MapPin className="w-4 h-4 mr-2" />
                          Manage Locations
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
