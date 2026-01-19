'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

const equipmentCategories = [
  { value: 'tractor', label: 'Tractors' },
  { value: 'combine', label: 'Combines' },
  { value: 'seeder', label: 'Seeders' },
  { value: 'sprayer', label: 'Sprayers' },
  { value: 'tillage', label: 'Tillage' },
  { value: 'hay_equipment', label: 'Hay Equipment' },
  { value: 'truck_trailer', label: 'Trucks & Trailers' },
  { value: 'other', label: 'Other' },
];

interface Equipment {
  id: string;
  title: string;
  description: string;
  category: string;
  make: string | null;
  model: string | null;
  year: number | null;
  rate: string;
  rate_type: string;
  region: string;
  profiles: {
    full_name: string;
  };
}

const categoryLabels: Record<string, string> = {
  tractor: 'Tractor',
  combine: 'Combine',
  seeder: 'Seeder',
  sprayer: 'Sprayer',
  tillage: 'Tillage',
  hay_equipment: 'Hay Equipment',
  truck_trailer: 'Truck/Trailer',
  other: 'Other',
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          id,
          title,
          description,
          category,
          make,
          model,
          year,
          rate,
          rate_type,
          region,
          profiles (full_name)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching equipment:', error);
      } else {
        setEquipment(data || []);
      }
      setLoading(false);
    };

    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter((item) => {
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
          <h1 className="text-3xl font-bold text-foreground">Equipment Rentals</h1>
          <p className="text-muted mt-1">Rent farm equipment across Alberta</p>
        </div>
        <Link href="/equipment/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          List Equipment
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search equipment..."
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
              <option value="">All Types</option>
              {equipmentCategories.map((cat) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">Loading equipment...</p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">No equipment found matching your criteria.</p>
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <Link
              key={item.id}
              href={`/equipment/${item.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              {/* Placeholder for image */}
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                No Image
              </div>

              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                  {categoryLabels[item.category]}
                </span>
                <span className="font-semibold text-primary">
                  {item.rate}/{item.rate_type}
                </span>
              </div>

              <h2 className="font-semibold text-foreground mb-1">{item.title}</h2>

              {item.year && (
                <p className="text-sm text-muted mb-2">
                  {item.year} {item.make} {item.model}
                </p>
              )}

              <p className="text-sm text-muted mb-4 line-clamp-2">
                {item.description}
              </p>

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
