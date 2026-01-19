'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

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

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  quantity: string | null;
  region: string;
  profiles: {
    full_name: string;
  };
}

const categoryLabels: Record<string, string> = {
  seed: 'Seed',
  fertilizer: 'Fertilizer',
  chemical: 'Chemical',
  feed: 'Feed',
  livestock: 'Livestock',
  produce: 'Produce',
  equipment_parts: 'Parts',
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          category,
          price,
          quantity,
          region,
          profiles (full_name)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts((data as Product[]) || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || item.region === selectedRegion;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products & Supplies</h1>
          <p className="text-muted mt-1">Buy and sell agricultural products</p>
        </div>
        <Link href="/products/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          List Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {productCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input"
            >
              <option value="">All Regions</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">No products found matching your criteria.</p>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
                  {categoryLabels[item.category]}
                </span>
                <span className="font-semibold text-primary">{item.price}</span>
              </div>

              <h2 className="font-semibold text-foreground mb-2">{item.title}</h2>

              <p className="text-sm text-muted mb-4 line-clamp-2">
                {item.description}
              </p>

              {item.quantity && (
                <p className="text-sm text-muted mb-4">{item.quantity}</p>
              )}

              <div className="flex items-center justify-between text-sm text-muted border-t border-border pt-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.region}
                </span>
                <span>{item.profiles?.full_name}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
