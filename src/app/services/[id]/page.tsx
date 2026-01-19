'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  Phone,
  Globe,
  Mail,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Service {
  id: string;
  business_name: string;
  description: string;
  category: string;
  region: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
  user_id: string;
}

const categoryLabels: Record<string, string> = {
  mechanic: 'Heavy Duty Mechanic',
  veterinary: 'Veterinary',
  agronomist: 'Agronomist',
  lab_testing: 'Lab Testing',
  custom_farming: 'Custom Farming',
  trucking: 'Trucking & Hauling',
  welding: 'Welding & Fabrication',
  other: 'Other Services',
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
      } else {
        setService(data);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const handleContact = async () => {
    if (!user || !service) return;

    if (user.id === service.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, service.user_id);
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

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Service Not Found</h2>
          <p className="text-muted mb-4">This listing may have been removed.</p>
          <Link href="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-full">
                  {categoryLabels[service.category]}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-3">
                  {service.business_name}
                </h1>
                <p className="text-muted flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {service.region}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-t border-border text-sm">
              {service.phone && (
                <a
                  href={`tel:${service.phone}`}
                  className="flex items-center gap-2 text-muted hover:text-primary"
                >
                  <Phone className="w-4 h-4" />
                  {service.phone}
                </a>
              )}
              {service.email && (
                <a
                  href={`mailto:${service.email}`}
                  className="flex items-center gap-2 text-muted hover:text-primary"
                >
                  <Mail className="w-4 h-4" />
                  {service.email}
                </a>
              )}
              {service.website && (
                <a
                  href={`https://${service.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-primary"
                >
                  <Globe className="w-4 h-4" />
                  {service.website}
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              About This Service
            </h2>
            <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
              {service.description}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="card sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">
              Get in Touch
            </h3>

            {service.phone && (
              <a
                href={`tel:${service.phone}`}
                className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            )}

            {user ? (
              <button
                onClick={handleContact}
                disabled={startingChat || user.id === service.user_id}
                className="btn-outline w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === service.user_id ? 'Your Listing' : 'Send Message'}
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-outline w-full flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Sign in to Message
              </Link>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Listed since {new Date(service.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
