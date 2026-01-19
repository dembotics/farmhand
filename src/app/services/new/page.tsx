'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const serviceCategories = [
  { value: 'mechanic', label: 'Heavy Duty Mechanic' },
  { value: 'veterinary', label: 'Veterinary' },
  { value: 'agronomist', label: 'Agronomist / Consultant' },
  { value: 'lab_testing', label: 'Lab Testing (Soil, Water, etc.)' },
  { value: 'custom_farming', label: 'Custom Farming (Spraying, Seeding, etc.)' },
  { value: 'trucking', label: 'Trucking & Hauling' },
  { value: 'welding', label: 'Welding & Fabrication' },
  { value: 'other', label: 'Other Services' },
];

export default function NewServicePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    category: 'mechanic',
    region: '',
    phone: '',
    email: '',
    website: '',
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
      setError('You must be logged in to list a service');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('service_providers')
        .insert({
          user_id: user.id,
          business_name: formData.business_name,
          description: formData.description,
          category: formData.category,
          region: formData.region,
          phone: formData.phone || null,
          email: formData.email || null,
          website: formData.website || null,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/services');
    } catch (err) {
      console.error('Error posting service:', err);
      setError(err instanceof Error ? err.message : 'Failed to list service');
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
          <p className="text-muted mb-4">You must be logged in to list a service.</p>
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
        href="/services"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">List Your Service</h1>
        <p className="text-muted mb-6">
          Add your business to the service directory.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="business_name" className="label">Business Name *</label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              value={formData.business_name}
              onChange={handleChange}
              placeholder="e.g., Prairie Mobile Mechanics"
              required
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="label">Service Type *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input"
              >
                {serviceCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="phone" className="label">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="403-555-0123"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="website" className="label">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                placeholder="www.example.com"
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
              placeholder="Describe your services - what you offer, specializations, service area, hours, experience..."
              required
              className="input"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">Requires active subscription</p>
            <div className="flex gap-3">
              <Link href="/services" className="btn-outline">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Posting...' : 'List Service'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
