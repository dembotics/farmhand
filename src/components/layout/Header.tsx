'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Briefcase,
  Users,
  Wrench,
  Tractor,
  MapPin,
  Package,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Workers', href: '/workers', icon: Users },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Equipment', href: '/equipment', icon: Tractor },
  { name: 'Land', href: '/land', icon: MapPin },
  { name: 'Products', href: '/products', icon: Package },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl text-foreground">FarmHand</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/messages"
                  className="p-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link
                  href="/account"
                  className="p-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <span className="text-sm text-muted">
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-outline text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline text-sm">
                  Log In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="p-2 text-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted hover:text-foreground hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <hr className="my-3 border-border" />
              {user && (
                <>
                  <Link
                    href="/messages"
                    className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted hover:text-foreground hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="w-5 h-5" />
                    Messages
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted hover:text-foreground hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Account
                  </Link>
                </>
              )}
              <hr className="my-3 border-border" />
              <div className="flex gap-3 px-3">
                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-outline text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn-outline text-sm flex-1 text-center">
                      Log In
                    </Link>
                    <Link href="/auth/signup" className="btn-primary text-sm flex-1 text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
