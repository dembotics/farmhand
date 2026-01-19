'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  ArrowLeft,
  MessageSquare,
  Share2,
  Flag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  category: string;
  region: string;
  location: string | null;
  pay_rate: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    region: string;
  };
}

const jobTypeLabels: Record<string, string> = {
  seasonal: 'Seasonal',
  permanent: 'Permanent',
  contract: 'Contract',
  daily: 'Daily',
};

const categoryLabels: Record<string, string> = {
  general_farm: 'General Farm',
  livestock: 'Livestock',
  crops: 'Crops',
  equipment_operator: 'Equipment Operator',
  maintenance: 'Maintenance',
  management: 'Management',
  other: 'Other',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles (id, full_name, region)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
      } else if (data) {
        // Handle profiles being returned as array
        const jobData = {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        };
        setJob(jobData);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleApply = async () => {
    setApplying(true);
    // TODO: Submit application to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplied(true);
    setApplying(false);
  };

  const handleMessage = async () => {
    if (!user || !job) return;

    // Don't message yourself
    if (user.id === job.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, job.user_id);
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

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Job Not Found</h2>
          <p className="text-muted mb-4">This job listing may have been removed.</p>
          <Link href="/jobs" className="btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                    {jobTypeLabels[job.job_type]}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
                    {categoryLabels[job.category]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-muted hover:text-foreground hover:bg-gray-100 rounded-lg">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted" />
                  {job.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Pay Rate</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-muted" />
                  {job.pay_rate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Start Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted" />
                  {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Flexible'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted" />
                  {job.end_date
                    ? `Until ${new Date(job.end_date).toLocaleDateString()}`
                    : 'Ongoing'}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted">
              Posted {new Date(job.created_at).toLocaleDateString()} in {job.region}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Job Description
            </h2>
            <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <div className="card">
            {applied ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground">Application Sent!</h3>
                <p className="text-sm text-muted mt-1">
                  The employer will review your profile and get back to you.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-foreground mb-4">
                  Interested in this job?
                </h3>
                <textarea
                  placeholder="Add a message to your application (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="input mb-4"
                />
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {applying ? 'Sending...' : 'Apply Now'}
                </button>
                <p className="text-xs text-muted text-center mt-3">
                  Your profile will be shared with the employer
                </p>
              </>
            )}
          </div>

          {/* Employer Card */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Posted by</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {job.profiles.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {job.profiles.full_name}
                </p>
                <p className="text-sm text-muted">{job.profiles.region}</p>
              </div>
            </div>
            {user ? (
              <button
                onClick={handleMessage}
                disabled={startingChat || user.id === job.user_id}
                className="btn-outline w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === job.user_id ? 'Your Listing' : 'Message Employer'}
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
          </div>
        </div>
      </div>
    </div>
  );
}
