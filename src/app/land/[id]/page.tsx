'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  Phone,
  Ruler,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Land {
  id: string;
  title: string;
  description: string;
  land_type: string;
  acres: number;
  rate: string;
  rate_type: string;
  region: string;
  location: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    phone: string | null;
    region: string;
  };
}

const landTypeLabels: Record<string, string> = {
  cropland: 'Cropland',
  pasture: 'Pasture',
  mixed: 'Mixed Use',
  hay: 'Hay Land',
  other: 'Other',
};

export default function LandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('land')
        .select(`
          *,
          profiles (id, full_name, phone, region)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching land:', error);
      } else {
        setLand(data);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchLand();
    }
  }, [params.id]);

  const handleInquiry = async () => {
    if (!user || !land) return;

    if (user.id === land.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, land.user_id);
    setStartingChat(false);

    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Land Not Found</h2>
          <p className="text-muted mb-4">This listing may have been removed.</p>
          <Link href="/land" className="btn-primary">
            Back to Land
          </Link>
        </div>
      </div>
    );
  }

  const totalRent = land.rate_type === 'acre'
    ? `$${parseInt(land.rate.replace('$', '')) * land.acres}/year`
    : land.rate;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/land"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Land Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="card p-0 overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              No Images Available
            </div>
          </div>

          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  {landTypeLabels[land.land_type]}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-3">
                  {land.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted" />
                  {land.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Size</p>
                <p className="font-medium flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-muted" />
                  {land.acres} acres
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Region</p>
                <p className="font-medium">{land.region}</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted">
              Posted {new Date(land.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Details
            </h2>
            <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
              {land.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="card">
            <div className="text-center mb-4">
              <p className="text-sm text-muted">Rental Rate</p>
              <p className="text-3xl font-bold text-primary">
                {land.rate}
                <span className="text-lg font-normal text-muted">
                  /{land.rate_type}
                </span>
              </p>
              {land.rate_type === 'acre' && (
                <p className="text-sm text-muted mt-1">
                  {totalRent} total
                </p>
              )}
            </div>

            {user ? (
              <button
                onClick={handleInquiry}
                disabled={startingChat || user.id === land.user_id}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === land.user_id ? 'Your Listing' : 'Inquire About This Land'}
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Sign in to Inquire
              </Link>
            )}
            {land.profiles.phone && (
              <a
                href={`tel:${land.profiles.phone}`}
                className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
              >
                <Phone className="w-4 h-4" />
                Call {land.profiles.phone}
              </a>
            )}
          </div>

          {/* Owner Card */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Listed by</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {land.profiles.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {land.profiles.full_name}
                </p>
                <p className="text-sm text-muted">{land.profiles.region}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
