import Link from 'next/link';
import {
  Briefcase,
  Users,
  Wrench,
  Tractor,
  MapPin,
  Package,
  Star,
  ArrowRight,
} from 'lucide-react';

const categories = [
  {
    name: 'Jobs',
    description: 'Find seasonal and permanent farm work',
    href: '/jobs',
    icon: Briefcase,
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Workers',
    description: 'Browse experienced agricultural workers',
    href: '/workers',
    icon: Users,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Services',
    description: 'Mechanics, vets, agronomists & more',
    href: '/services',
    icon: Wrench,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Equipment',
    description: 'Rent tractors, combines & implements',
    href: '/equipment',
    icon: Tractor,
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    name: 'Land',
    description: 'Pasture and cropland for rent',
    href: '/land',
    icon: MapPin,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Products',
    description: 'Seed, fertilizer, feed & supplies',
    href: '/products',
    icon: Package,
    color: 'bg-purple-100 text-purple-700',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Alberta&apos;s Agricultural Marketplace
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Connect with farm jobs, workers, equipment rentals, and services.
              Built for Alberta&apos;s farming community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/jobs"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          What are you looking for?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {category.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            How FarmHand Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Create Your Profile
              </h3>
              <p className="text-muted text-sm">
                Sign up as a farmer, worker, or service provider. Browsing is
                always free.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Post or Browse
              </h3>
              <p className="text-muted text-sm">
                Post jobs, equipment, land, or services. Or browse listings and
                worker profiles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Connect Directly
              </h3>
              <p className="text-muted text-sm">
                Message each other, arrange details, and leave reviews after
                working together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Trusted by Alberta Farmers
          </h2>
          <div className="flex items-center gap-1 text-secondary">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-muted italic mb-4">
              &quot;Found reliable harvest help within a week. The reviews helped me
              know who to trust.&quot;
            </p>
            <p className="font-semibold text-foreground">- Ranch Owner, Central Alberta</p>
          </div>
          <div className="card">
            <p className="text-muted italic mb-4">
              &quot;Finally a place to find farm work that isn&apos;t buried in Facebook
              groups.&quot;
            </p>
            <p className="font-semibold text-foreground">- Seasonal Worker, Edmonton Area</p>
          </div>
          <div className="card">
            <p className="text-muted italic mb-4">
              &quot;Rented out my swather during downtime. Easy money.&quot;
            </p>
            <p className="font-semibold text-foreground">- Farmer, Southern Alberta</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join Alberta&apos;s agricultural community. Free to browse, $15/month to
            post listings.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
