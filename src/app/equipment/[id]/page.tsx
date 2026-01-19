'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  Share2,
  Phone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Equipment {
  id: string;
  title: string;
  description: string;
  category: string;
  make: string | null;
  model: string | null;
  year: number | null;
  rate: string;
  rate_type: string;
  region: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    phone: string | null;
    region: string;
  };
}

const categoryLabels: Record<string, string> = {
  tractor: 'Tractor',
  combine: 'Combine',
  seeder: 'Seeder',
  sprayer: 'Sprayer',
  tillage: 'Tillage',
  hay_equipment: 'Hay Equipment',
  truck_trailer: 'Truck/Trailer',
  other: 'Other',
};

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          profiles (id, full_name, phone, region)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching equipment:', error);
      } else if (data) {
        const equipmentData = {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        };
        setEquipment(equipmentData);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchEquipment();
    }
  }, [params.id]);

  const handleInquiry = async () => {
    if (!user || !equipment) return;

    if (user.id === equipment.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, equipment.user_id);
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

  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Equipment Not Found</h2>
          <p className="text-muted mb-4">This listing may have been removed.</p>
          <Link href="/equipment" className="btn-primary">
            Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/equipment"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equipment
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
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  {categoryLabels[equipment.category]}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-3">
                  {equipment.title}
                </h1>
                {equipment.year && (
                  <p className="text-muted mt-1">
                    {equipment.year} {equipment.make} {equipment.model}
                  </p>
                )}
              </div>
              <button className="p-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted">Rental Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {equipment.rate}
                  <span className="text-sm font-normal text-muted">
                    /{equipment.rate_type}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted" />
                  {equipment.region}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted">
              Posted {new Date(equipment.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Description
            </h2>
            <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
              {equipment.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">
              Interested in renting?
            </h3>
            {user ? (
              <button
                onClick={handleInquiry}
                disabled={startingChat || user.id === equipment.user_id}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === equipment.user_id ? 'Your Listing' : 'Send Inquiry'}
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
            {equipment.profiles.phone && (
              <a
                href={`tel:${equipment.profiles.phone}`}
                className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
              >
                <Phone className="w-4 h-4" />
                Call {equipment.profiles.phone}
              </a>
            )}
          </div>

          {/* Owner Card */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Listed by</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {equipment.profiles.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {equipment.profiles.full_name}
                </p>
                <p className="text-sm text-muted">{equipment.profiles.region}</p>
              </div>
            </div>
          </div>

          {/* Safety Note */}
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Rental Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>- Inspect equipment before renting</li>
              <li>- Get rental terms in writing</li>
              <li>- Confirm insurance coverage</li>
              <li>- Agree on fuel/maintenance responsibilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
