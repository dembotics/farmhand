'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const landTypes = [
  { value: 'cropland', label: 'Cropland' },
  { value: 'pasture', label: 'Pasture' },
  { value: 'mixed', label: 'Mixed Use' },
  { value: 'hay', label: 'Hay Land' },
  { value: 'other', label: 'Other' },
];

const rateTypes = [
  { value: 'acre', label: 'Per Acre' },
  { value: 'total', label: 'Total (Flat Rate)' },
  { value: 'season', label: 'Per Season' },
  { value: 'year', label: 'Per Year' },
];

export default function NewLandPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    land_type: 'cropland',
    acres: '',
    rate: '',
    rate_type: 'acre',
    region: '',
    location: '',
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
      setError('You must be logged in to list land');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('land')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          land_type: formData.land_type,
          acres: parseInt(formData.acres),
          rate: formData.rate,
          rate_type: formData.rate_type,
          region: formData.region,
          location: formData.location || null,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/land');
    } catch (err) {
      console.error('Error posting land:', err);
      setError(err instanceof Error ? err.message : 'Failed to list land');
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
          <p className="text-muted mb-4">You must be logged in to list land.</p>
          <Link href="/auth/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!profile?.is_subscribed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Subscription Required</h2>
          <p className="text-muted mb-4">You need an active subscription to post listings.</p>
          <Link href="/pricing" className="btn-primary">
            View Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/land"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Land Listings
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">List Land for Rent</h1>
        <p className="text-muted mb-6">
          Fill out the details below to list your land.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="label">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 640 Acres Prime Cropland"
              required
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="land_type" className="label">Land Type *</label>
              <select
                id="land_type"
                name="land_type"
                value={formData.land_type}
                onChange={handleChange}
                required
                className="input"
              >
                {landTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="acres" className="label">Acres *</label>
              <input
                id="acres"
                name="acres"
                type="number"
                value={formData.acres}
                onChange={handleChange}
                placeholder="640"
                required
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rate" className="label">Rental Rate *</label>
              <input
                id="rate"
                name="rate"
                type="text"
                value={formData.rate}
                onChange={handleChange}
                placeholder="$55"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="rate_type" className="label">Rate Type *</label>
              <select
                id="rate_type"
                name="rate_type"
                value={formData.rate_type}
                onChange={handleChange}
                required
                className="input"
              >
                {rateTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className="label">Region *</label>
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
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="label">Specific Location</label>
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

          <div>
            <label htmlFor="description" className="label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Describe the land - soil type, crop history, infrastructure, legal land description, rental terms..."
              required
              className="input"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">Requires active subscription</p>
            <div className="flex gap-3">
              <Link href="/land" className="btn-outline">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Posting...' : 'List Land'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
