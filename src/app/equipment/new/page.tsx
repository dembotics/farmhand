'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const equipmentCategories = [
  { value: 'tractor', label: 'Tractor' },
  { value: 'combine', label: 'Combine' },
  { value: 'seeder', label: 'Seeder / Drill' },
  { value: 'sprayer', label: 'Sprayer' },
  { value: 'tillage', label: 'Tillage Equipment' },
  { value: 'hay_equipment', label: 'Hay Equipment' },
  { value: 'truck_trailer', label: 'Truck / Trailer' },
  { value: 'other', label: 'Other' },
];

const rateTypes = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'day', label: 'Per Day' },
  { value: 'week', label: 'Per Week' },
  { value: 'month', label: 'Per Month' },
  { value: 'season', label: 'Per Season' },
];

export default function NewEquipmentPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tractor',
    make: '',
    model: '',
    year: '',
    rate: '',
    rate_type: 'day',
    region: '',
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
      setError('You must be logged in to list equipment');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('equipment')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          make: formData.make || null,
          model: formData.model || null,
          year: formData.year ? parseInt(formData.year) : null,
          rate: formData.rate,
          rate_type: formData.rate_type,
          region: formData.region,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/equipment');
    } catch (err) {
      console.error('Error posting equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to list equipment');
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
          <p className="text-muted mb-4">You must be logged in to list equipment.</p>
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
        href="/equipment"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equipment
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">List Equipment for Rent</h1>
        <p className="text-muted mb-6">
          Fill out the details below to list your equipment.
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
              placeholder="e.g., John Deere S780 Combine"
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="category" className="label">Equipment Type *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              {equipmentCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="make" className="label">Make</label>
              <input
                id="make"
                name="make"
                type="text"
                value={formData.make}
                onChange={handleChange}
                placeholder="John Deere"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="model" className="label">Model</label>
              <input
                id="model"
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                placeholder="S780"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="year" className="label">Year</label>
              <input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="2020"
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
                placeholder="$300"
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
            <label htmlFor="description" className="label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the equipment, condition, included attachments, rental terms, availability..."
              required
              className="input"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">Requires active subscription</p>
            <div className="flex gap-3">
              <Link href="/equipment" className="btn-outline">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Posting...' : 'List Equipment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
