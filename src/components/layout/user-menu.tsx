"use client";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings, Shield, CreditCard, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();

  if (!user) return null;

  const roleColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "info"> = {
    CUSTOMER: "info",
    TECHNICIAN: "success",
    POWER_OPERATOR: "warning",
    ADMIN: "destructive",
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage || ""} alt={user.name} />
            <AvatarFallback className="text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <div className="mt-1">
            <Badge variant={roleColors[user.role as keyof typeof roleColors] || "default"}>
              {user.role}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 w-full">
            <Settings className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 w-full">
            <Shield className="h-4 w-4" />
            Security
          </Link>
        </DropdownMenuItem>
        {user.role === "CUSTOMER" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/payments" className="flex items-center gap-2 w-full">
                <CreditCard className="h-4 w-4" />
                Payments
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {["ADMIN", "POWER_OPERATOR"].includes(user.role) && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/analytics" className="flex items-center gap-2 w-full">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => { await logout(); router.push("/auth/login"); }} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}