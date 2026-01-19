'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

const landTypes = [
  { value: 'cropland', label: 'Cropland' },
  { value: 'pasture', label: 'Pasture' },
  { value: 'mixed', label: 'Mixed Use' },
  { value: 'hay', label: 'Hay Land' },
  { value: 'other', label: 'Other' },
];

interface Land {
  id: string;
  title: string;
  description: string;
  land_type: string;
  acres: number;
  rate: string;
  rate_type: string;
  region: string;
  location: string | null;
  profiles: {
    full_name: string;
  };
}

const landTypeLabels: Record<string, string> = {
  cropland: 'Cropland',
  pasture: 'Pasture',
  mixed: 'Mixed',
  hay: 'Hay Land',
  other: 'Other',
};

export default function LandPage() {
  const [land, setLand] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchLand = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('land')
        .select(`
          id,
          title,
          description,
          land_type,
          acres,
          rate,
          rate_type,
          region,
          location,
          profiles (full_name)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching land:', error);
      } else {
        setLand(data || []);
      }
      setLoading(false);
    };

    fetchLand();
  }, []);

  const filteredLand = land.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || item.region === selectedRegion;
    const matchesType = !selectedType || item.land_type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Land Rentals</h1>
          <p className="text-muted mt-1">Find cropland, pasture, and hay land in Alberta</p>
        </div>
        <Link href="/land/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          List Land
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search land listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              {landTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-muted">Loading land listings...</p>
          </div>
        ) : filteredLand.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted">No land listings found matching your criteria.</p>
          </div>
        ) : (
          filteredLand.map((item) => (
            <Link
              key={item.id}
              href={`/land/${item.id}`}
              className="card block hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                      {landTypeLabels[item.land_type]}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {item.location ? `${item.location}, ` : ''}{item.region}
                    </span>
                    <span>{item.acres} acres</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {item.rate}/{item.rate_type}
                  </p>
                  <p className="text-sm text-muted mt-1">{item.profiles?.full_name}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
