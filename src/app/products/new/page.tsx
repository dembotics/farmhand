'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const productCategories = [
  { value: 'seed', label: 'Seed' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'chemical', label: 'Chemicals' },
  { value: 'feed', label: 'Feed' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'produce', label: 'Produce' },
  { value: 'equipment_parts', label: 'Equipment Parts' },
  { value: 'other', label: 'Other' },
];

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'seed',
    price: '',
    quantity: '',
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
      setError('You must be logged in to list a product');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          quantity: formData.quantity || null,
          region: formData.region,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/products');
    } catch (err) {
      console.error('Error posting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to list product');
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
          <p className="text-muted mb-4">You must be logged in to list a product.</p>
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
        href="/products"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">List a Product</h1>
        <p className="text-muted mb-6">
          Sell seed, fertilizer, feed, livestock, or other agricultural products.
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
              placeholder="e.g., Certified Wheat Seed - AAC Brandon"
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="category" className="label">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              {productCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="label">Price *</label>
              <input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., $18/bushel"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="label">Quantity Available</label>
              <input
                id="quantity"
                name="quantity"
                type="text"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 500 bushels"
                className="input"
              />
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
              placeholder="Describe the product - specifications, condition, certifications, pricing tiers, delivery options..."
              required
              className="input"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">Requires active subscription</p>
            <div className="flex gap-3">
              <Link href="/products" className="btn-outline">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Posting...' : 'List Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
