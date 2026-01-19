'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Globe, Plus } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

const serviceCategories = [
  { value: 'mechanic', label: 'Heavy Duty Mechanic' },
  { value: 'veterinary', label: 'Veterinary' },
  { value: 'agronomist', label: 'Agronomist' },
  { value: 'lab_testing', label: 'Lab Testing' },
  { value: 'custom_farming', label: 'Custom Farming' },
  { value: 'trucking', label: 'Trucking & Hauling' },
  { value: 'welding', label: 'Welding & Fabrication' },
  { value: 'other', label: 'Other Services' },
];

interface Service {
  id: string;
  business_name: string;
  description: string;
  category: string;
  region: string;
  phone: string | null;
  website: string | null;
}

const categoryLabels: Record<string, string> = {
  mechanic: 'Mechanic',
  veterinary: 'Veterinary',
  agronomist: 'Agronomist',
  lab_testing: 'Lab Testing',
  custom_farming: 'Custom Farming',
  trucking: 'Trucking',
  welding: 'Welding',
  other: 'Other',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          id,
          business_name,
          description,
          category,
          region,
          phone,
          website
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || service.region === selectedRegion;
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted mt-1">Find agricultural service providers in Alberta</p>
        </div>
        <Link href="/services/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          List Your Service
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search services..."
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
              {serviceCategories.map((cat) => (
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
            <p className="text-muted">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">No services found matching your criteria.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-foreground text-lg">
                    {service.business_name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                    {categoryLabels[service.category]}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted border-t border-border pt-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {service.region}
                </span>
                {service.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {service.phone}
                  </span>
                )}
                {service.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Website
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
