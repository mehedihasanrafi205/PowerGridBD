"use client";

import { CreditCard, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { roleBadgeVariant } from "@/lib/status-variants";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  } | null;
}

/** Role-scoped profile route; operator/admin have no profile page. */
function profileHref(role: string): string | null {
  if (role === "CUSTOMER") return "/customer/profile";
  if (role === "TECHNICIAN") return "/technician/profile";
  return null;
}

/**
 * UserMenu — the authenticated account dropdown.
 *
 * Identity header with role badge, role-aware links (profile
 * and payments only where those routes exist), and working
 * logout. Mounted in the dashboard shell header.
 */
export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();

  if (!user) return null;

  const profile = profileHref(user.role);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage || ""} alt={user.name} />
            <AvatarFallback className="text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:block">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <div className="mt-1.5">
            <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
          Account
        </DropdownMenuLabel>
        {profile && (
          <DropdownMenuItem asChild>
            <Link href={profile} className="flex w-full items-center gap-2">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "CUSTOMER" && (
          <DropdownMenuItem asChild>
            <Link
              href="/customer/payments"
              className="flex w-full items-center gap-2"
            >
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              Payments
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
