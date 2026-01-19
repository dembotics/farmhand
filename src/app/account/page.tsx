'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Briefcase,
  Tractor,
  MapPin,
  Package,
} from 'lucide-react';

// Mock user data
const mockUser = {
  full_name: 'John Smith',
  email: 'john@example.com',
  role: 'farmer',
  region: 'Central Alberta',
  is_subscribed: false,
};

const myListings = [
  { type: 'Jobs', count: 2, icon: Briefcase, href: '/account/listings/jobs' },
  { type: 'Equipment', count: 1, icon: Tractor, href: '/account/listings/equipment' },
  { type: 'Land', count: 0, icon: MapPin, href: '/account/listings/land' },
  { type: 'Products', count: 3, icon: Package, href: '/account/listings/products' },
];

export default function AccountPage() {
  const [user] = useState(mockUser);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account</h1>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{user.full_name}</h2>
            <p className="text-muted">{user.email}</p>
            <p className="text-sm text-muted capitalize">{user.role} • {user.region}</p>
          </div>
          <Link href="/account/edit" className="btn-outline text-sm">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Subscription</h3>
            <p className="text-sm text-muted">
              {user.is_subscribed
                ? 'Active - $15/month'
                : 'Free account - Browsing only'}
            </p>
          </div>
          {!user.is_subscribed ? (
            <Link href="/pricing" className="btn-primary text-sm">
              Upgrade to Post
            </Link>
          ) : (
            <Link href="/account/subscription" className="btn-outline text-sm">
              Manage
            </Link>
          )}
        </div>
      </div>

      {/* My Listings */}
      <div className="card mb-6">
        <h3 className="font-semibold text-foreground mb-4">My Listings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {myListings.map((listing) => (
            <Link
              key={listing.type}
              href={listing.href}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <listing.icon className="w-6 h-6 text-muted mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{listing.count}</p>
              <p className="text-sm text-muted">{listing.type}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="card">
        <h3 className="font-semibold text-foreground mb-4">Settings</h3>
        <div className="divide-y divide-border">
          <Link
            href="/account/settings"
            className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted" />
              <span>Account Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </Link>
          <Link
            href="/account/notifications"
            className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </Link>
          <Link
            href="/account/billing"
            className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted" />
              <span>Billing & Payments</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </Link>
          <button
            onClick={() => console.log('Logout')}
            className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors w-full text-left text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
