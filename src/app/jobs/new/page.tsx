'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const jobCategories = [
  { value: 'general_farm', label: 'General Farm Labour' },
  { value: 'livestock', label: 'Livestock / Cattle' },
  { value: 'crops', label: 'Crops / Grain' },
  { value: 'equipment_operator', label: 'Equipment Operator' },
  { value: 'maintenance', label: 'Maintenance / Repair' },
  { value: 'management', label: 'Farm Management' },
  { value: 'other', label: 'Other' },
];

const jobTypes = [
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'daily', label: 'Daily / Casual' },
];

export default function NewJobPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'seasonal',
    category: 'general_farm',
    region: '',
    location: '',
    pay_rate: '',
    start_date: '',
    end_date: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to post a job');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          job_type: formData.job_type,
          category: formData.category,
          region: formData.region,
          location: formData.location || null,
          pay_rate: formData.pay_rate || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/jobs');
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Login Required</h2>
          <p className="text-muted mb-4">You must be logged in to post a job.</p>
          <Link href="/auth/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">Post a Job</h1>
        <p className="text-muted mb-6">
          Fill out the details below to post your job listing.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">
              Job Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Harvest Combine Operator"
              required
              className="input"
            />
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job_type" className="label">
                Job Type *
              </label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
                className="input"
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input"
              >
                {jobCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Region and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className="label">
                Region *
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select region</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="label">
                Specific Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Near Lacombe"
                className="input"
              />
            </div>
          </div>

          {/* Pay Rate */}
          <div>
            <label htmlFor="pay_rate" className="label">
              Pay Rate
            </label>
            <input
              id="pay_rate"
              name="pay_rate"
              type="text"
              value={formData.pay_rate}
              onChange={handleChange}
              placeholder="e.g., $25-30/hour or $4,000/month"
              className="input"
            />
            <p className="text-xs text-muted mt-1">
              Leave blank if you prefer to discuss pay with applicants
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="label">
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="label">
                End Date
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className="input"
              />
              <p className="text-xs text-muted mt-1">
                Leave blank for permanent or ongoing positions
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Describe the job responsibilities, requirements, qualifications, and any other important details..."
              required
              className="input"
            />
            <p className="text-xs text-muted mt-1">
              Tip: Include responsibilities, requirements, and what makes this a great opportunity
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">
              Requires active subscription to post
            </p>
            <div className="flex gap-3">
              <Link href="/jobs" className="btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
