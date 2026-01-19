'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Clock, Plus } from 'lucide-react';
import { REGIONS } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface Job {
  id: string;
  title: string;
  job_type: string;
  category: string;
  region: string;
  location: string | null;
  pay_rate: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const jobTypeLabels: Record<string, string> = {
  seasonal: 'Seasonal',
  permanent: 'Permanent',
  contract: 'Contract',
  daily: 'Daily',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          job_type,
          category,
          region,
          location,
          pay_rate,
          start_date,
          end_date,
          description,
          created_at,
          profiles (full_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs((data as Job[]) || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || job.region === selectedRegion;
    const matchesType = !selectedType || job.job_type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farm Jobs</h1>
          <p className="text-muted mt-1">Find agricultural work across Alberta</p>
        </div>
        <Link href="/jobs/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          Post a Job
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Region Filter */}
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

          {/* Type Filter */}
          <div className="md:w-40">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              <option value="seasonal">Seasonal</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-muted">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted">No jobs found matching your criteria.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="card block hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-foreground hover:text-primary">
                      {job.title}
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {jobTypeLabels[job.job_type]}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location ? `${job.location}, ` : ''}{job.region}
                    </span>
                    {job.start_date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Starts {new Date(job.start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {job.pay_rate && <p className="font-semibold text-primary">{job.pay_rate}</p>}
                  <p className="text-sm text-muted mt-1">{job.profiles?.full_name}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
