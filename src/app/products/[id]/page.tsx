'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  Phone,
  Package,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateConversation } from '@/lib/messaging';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  quantity: string | null;
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
  seed: 'Seed',
  fertilizer: 'Fertilizer',
  chemical: 'Chemical',
  feed: 'Feed',
  livestock: 'Livestock',
  produce: 'Produce',
  equipment_parts: 'Equipment Parts',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  seed: 'bg-green-100 text-green-700',
  fertilizer: 'bg-blue-100 text-blue-700',
  chemical: 'bg-red-100 text-red-700',
  feed: 'bg-yellow-100 text-yellow-700',
  livestock: 'bg-orange-100 text-orange-700',
  produce: 'bg-emerald-100 text-emerald-700',
  equipment_parts: 'bg-gray-100 text-gray-700',
  other: 'bg-purple-100 text-purple-700',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles (id, full_name, phone, region)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else if (data) {
        const productData = {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        };
        setProduct(productData);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleInquiry = async () => {
    if (!user || !product) return;

    if (user.id === product.user_id) {
      alert("You can't message yourself!");
      return;
    }

    setStartingChat(true);
    const conversationId = await getOrCreateConversation(user.id, product.user_id);
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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted mb-4">This listing may have been removed.</p>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="card p-0 overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              <Package className="w-16 h-16" />
            </div>
          </div>

          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${categoryColors[product.category]}`}>
                  {categoryLabels[product.category]}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-3">
                  {product.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted" />
                  {product.region}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Available Quantity</p>
                <p className="font-medium">{product.quantity}</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted">
              Posted {new Date(product.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Details
            </h2>
            <div className="prose prose-sm max-w-none text-muted whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="card">
            <div className="text-center mb-4">
              <p className="text-sm text-muted">Price</p>
              <p className="text-3xl font-bold text-primary">
                {product.price}
              </p>
            </div>

            {user ? (
              <button
                onClick={handleInquiry}
                disabled={startingChat || user.id === product.user_id}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {startingChat ? 'Opening chat...' : user.id === product.user_id ? 'Your Listing' : 'Contact Seller'}
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Sign in to Contact
              </Link>
            )}
            {product.profiles.phone && (
              <a
                href={`tel:${product.profiles.phone}`}
                className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
              >
                <Phone className="w-4 h-4" />
                Call {product.profiles.phone}
              </a>
            )}
          </div>

          {/* Seller Card */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Sold by</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {product.profiles.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {product.profiles.full_name}
                </p>
                <p className="text-sm text-muted">{product.profiles.region}</p>
              </div>
            </div>
          </div>

          {/* Safety Note */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Buying Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>- Inspect products before purchasing</li>
              <li>- Ask for documentation/certification</li>
              <li>- Agree on pickup/delivery details</li>
              <li>- Get receipts for purchases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
