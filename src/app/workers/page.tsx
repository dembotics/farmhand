'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Truck, Award } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface Worker {
  id: string;
  skills: string[];
  experience_years: number;
  availability: string | null;
  has_transportation: boolean;
  has_drivers_license: boolean;
  certifications: string[];
  profiles: {
    id: string;
    full_name: string;
    region: string;
    avatar_url: string | null;
  };
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('worker_profiles')
        .select(`
          id,
          skills,
          experience_years,
          availability,
          has_transportation,
          has_drivers_license,
          certifications,
          profiles (id, full_name, region, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workers:', error);
      } else {
        setWorkers((data as Worker[]) || []);
      }
      setLoading(false);
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesRegion =
      !selectedRegion || worker.profiles?.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Find Workers</h1>
        <p className="text-muted mt-1">
          Browse experienced agricultural workers in Alberta
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
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
            <p className="text-muted">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-muted">No workers found matching your criteria.</p>
          </div>
        ) : (
          filteredWorkers.map((worker) => (
            <Link
              key={worker.id}
              href={`/workers/${worker.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                  {worker.profiles?.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">
                    {worker.profiles?.full_name}
                  </h2>
                  <p className="text-sm text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {worker.profiles?.region}
                  </p>
                </div>
              </div>

              {worker.availability && (
                <p className="text-sm text-muted mb-3">{worker.availability}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {worker.skills?.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted border-t border-border pt-4">
                <span>{worker.experience_years || 0} years exp</span>
                {worker.has_transportation && (
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Own transport
                  </span>
                )}
                {worker.certifications?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Certified
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
