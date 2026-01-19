'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  Truck,
  Award,
  Calendar,
  Clock,
  Phone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Worker {
  id: string;
  user_id: string;
  skills: string[];
  experience_years: number;
  availability: string | null;
  has_transportation: boolean;
  has_drivers_license: boolean;
  certifications: string[];
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    region: string;
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
}

export default function WorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('worker_profiles')
        .select(`
          *,
          profiles (id, full_name, region, phone, bio, avatar_url)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching worker:', error);
      } else {
        setWorker(data);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchWorker();
    }
  }, [params.id]);

  const handleContact = async () => {
    if (!user || !worker) return;

    if (user.id === worker.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, worker.user_id);
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

  if (!worker) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Worker Not Found</h2>
          <p className="text-muted mb-4">This profile may have been removed.</p>
          <Link href="/workers" className="btn-primary">
            Back to Workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/workers"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {worker.profiles?.full_name?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {worker.profiles?.full_name}
                </h1>
                <p className="text-muted flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {worker.profiles?.region}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted">
                    <Clock className="w-4 h-4" />
                    {worker.experience_years} years experience
                  </span>
                  {worker.has_transportation && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Truck className="w-4 h-4" />
                      Own transport
                    </span>
                  )}
                </div>
              </div>
            </div>

            {worker.availability && (
              <div className="py-4 border-t border-border">
                <p className="text-sm text-muted mb-1">Availability</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted" />
                  {worker.availability}
                </p>
              </div>
            )}

            <div className="mt-4 text-sm text-muted">
              Member since {new Date(worker.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {worker.skills?.length > 0 ? (
                worker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-muted">No skills listed</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          {worker.certifications?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Certifications
              </h2>
              <div className="space-y-2">
                {worker.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Award className="w-5 h-5 text-yellow-600" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {worker.profiles?.bio && (
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
                {worker.profiles.bio}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="card sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">
              Contact This Worker
            </h3>

            {user ? (
              <button
                onClick={handleContact}
                disabled={startingChat || user.id === worker.user_id}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === worker.user_id ? 'Your Profile' : 'Send Message'}
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Sign in to Message
              </Link>
            )}

            {worker.profiles?.phone && (
              <a
                href={`tel:${worker.profiles.phone}`}
                className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
              >
                <Phone className="w-4 h-4" />
                Call {worker.profiles.phone}
              </a>
            )}
          </div>

          {/* Quick Facts */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Quick Facts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Experience</span>
                <span className="font-medium">{worker.experience_years} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Driver&apos;s License</span>
                <span className="font-medium">{worker.has_drivers_license ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Own Transportation</span>
                <span className="font-medium">{worker.has_transportation ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Certifications</span>
                <span className="font-medium">{worker.certifications?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
