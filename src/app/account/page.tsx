'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Briefcase,
  Tractor,
  MapPin,
  Package,
  Wrench,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface ListingCounts {
  jobs: number;
  equipment: number;
  land: number;
  products: number;
  services: number;
}

interface Listing {
  id: string;
  title?: string;
  business_name?: string;
  type: 'job' | 'equipment' | 'land' | 'product' | 'service';
}

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [counts, setCounts] = useState<ListingCounts>({ jobs: 0, equipment: 0, land: 0, products: 0, services: 0 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      const supabase = createClient();

      // Fetch counts and listings
      const [jobsRes, equipmentRes, landRes, productsRes, servicesRes] = await Promise.all([
        supabase.from('jobs').select('id, title').eq('user_id', user.id),
        supabase.from('equipment').select('id, title').eq('user_id', user.id),
        supabase.from('land').select('id, title').eq('user_id', user.id),
        supabase.from('products').select('id, title').eq('user_id', user.id),
        supabase.from('service_providers').select('id, business_name').eq('user_id', user.id),
      ]);

      setCounts({
        jobs: jobsRes.data?.length || 0,
        equipment: equipmentRes.data?.length || 0,
        land: landRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        services: servicesRes.data?.length || 0,
      });

      // Combine all listings
      const allListings: Listing[] = [
        ...(jobsRes.data || []).map(j => ({ ...j, type: 'job' as const })),
        ...(equipmentRes.data || []).map(e => ({ ...e, type: 'equipment' as const })),
        ...(landRes.data || []).map(l => ({ ...l, type: 'land' as const })),
        ...(productsRes.data || []).map(p => ({ ...p, type: 'product' as const })),
        ...(servicesRes.data || []).map(s => ({ ...s, type: 'service' as const })),
      ];
      setListings(allListings);
      setLoadingListings(false);
    };

    if (!loading && user) {
      fetchListings();
    } else if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (listing: Listing) => {
    if (!confirm(`Delete "${listing.title || listing.business_name}"?`)) return;

    setDeleting(listing.id);
    const supabase = createClient();

    const tableMap = {
      job: 'jobs',
      equipment: 'equipment',
      land: 'land',
      product: 'products',
      service: 'service_providers',
    };

    const { error } = await supabase
      .from(tableMap[listing.type])
      .delete()
      .eq('id', listing.id);

    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setListings(prev => prev.filter(l => l.id !== listing.id));
      setCounts(prev => ({
        ...prev,
        [listing.type === 'service' ? 'services' : listing.type + 's']: prev[listing.type === 'service' ? 'services' : (listing.type + 's') as keyof ListingCounts] - 1,
      }));
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const listingIcons = {
    job: Briefcase,
    equipment: Tractor,
    land: MapPin,
    product: Package,
    service: Wrench,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account</h1>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{profile.full_name}</h2>
            <p className="text-muted">{profile.email}</p>
            <p className="text-sm text-muted capitalize">{profile.role.replace('_', ' ')} • {profile.region}</p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Subscription</h3>
            <p className="text-sm text-muted">
              {profile.is_subscribed
                ? 'Active - $15/month'
                : 'Free account - Browsing only'}
            </p>
          </div>
          {!profile.is_subscribed ? (
            <Link href="/pricing" className="btn-primary text-sm">
              Upgrade to Post
            </Link>
          ) : (
            <span className="text-green-600 text-sm font-medium">Active</span>
          )}
        </div>
      </div>

      {/* My Listings Summary */}
      <div className="card mb-6">
        <h3 className="font-semibold text-foreground mb-4">My Listings</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Briefcase className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{counts.jobs}</p>
            <p className="text-sm text-muted">Jobs</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Tractor className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{counts.equipment}</p>
            <p className="text-sm text-muted">Equipment</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <MapPin className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{counts.land}</p>
            <p className="text-sm text-muted">Land</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Package className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{counts.products}</p>
            <p className="text-sm text-muted">Products</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Wrench className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{counts.services}</p>
            <p className="text-sm text-muted">Services</p>
          </div>
        </div>

        {/* Listing Items */}
        {loadingListings ? (
          <p className="text-muted text-center py-4">Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-muted text-center py-4">No listings yet</p>
        ) : (
          <div className="space-y-2">
            {listings.map((listing) => {
              const Icon = listingIcons[listing.type];
              const href = listing.type === 'service'
                ? `/services/${listing.id}`
                : `/${listing.type === 'job' ? 'jobs' : listing.type}/${listing.id}`;
              return (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <Link href={href} className="flex items-center gap-3 flex-1 hover:text-primary">
                    <Icon className="w-5 h-5 text-muted" />
                    <span className="truncate">{listing.title || listing.business_name}</span>
                    <span className="text-xs text-muted capitalize">({listing.type})</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(listing)}
                    disabled={deleting === listing.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings Menu */}
      <div className="card">
        <h3 className="font-semibold text-foreground mb-4">Settings</h3>
        <div className="divide-y divide-border">
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
            onClick={handleSignOut}
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
