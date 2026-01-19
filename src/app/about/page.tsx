import Link from 'next/link';
import { Users, Shield, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          About FarmHand
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Connecting Alberta&apos;s agricultural community - farmers, workers, and
          service providers - in one simple platform.
        </p>
      </div>

      {/* Mission */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted leading-relaxed">
          Alberta&apos;s farms run on relationships. Finding reliable harvest help,
          renting equipment for the season, or locating a mechanic who can fix
          your combine at 10pm - it all comes down to knowing the right people.
        </p>
        <p className="text-muted leading-relaxed mt-4">
          FarmHand makes those connections easier. We&apos;re building a place where
          farmers can find workers, workers can find opportunities, and everyone
          can find the services and equipment they need - with reviews from
          people who&apos;ve actually worked together.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Community First</h3>
          <p className="text-sm text-muted">
            Built for Alberta farmers, by people who understand agriculture.
          </p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Trust & Reviews</h3>
          <p className="text-sm text-muted">
            Real reviews from real farmers help you make informed decisions.
          </p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Local Focus</h3>
          <p className="text-sm text-muted">
            Focused on Alberta&apos;s regions so you find people and services nearby.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
        <div className="space-y-4 text-muted">
          <p>
            <strong className="text-foreground">For Workers:</strong> Create a
            free profile, list your skills and experience, and apply to jobs.
            Build your reputation through reviews from employers.
          </p>
          <p>
            <strong className="text-foreground">For Farmers:</strong> Browse
            worker profiles and post job listings. Rent out equipment or land
            when you&apos;re not using it. Find services you need. Leave reviews to
            help the community.
          </p>
          <p>
            <strong className="text-foreground">For Service Providers:</strong>{' '}
            List your business in our directory. Get found by farmers who need
            mechanics, vets, agronomists, custom operators, and more.
          </p>
        </div>
      </div>

      {/* Pricing note */}
      <div className="card bg-gray-50 mb-12">
        <h2 className="text-xl font-bold text-foreground mb-2">Simple Pricing</h2>
        <p className="text-muted mb-4">
          Browsing is always free. If you want to post listings (jobs, equipment,
          land, products, or services), it&apos;s $15/month for unlimited posts. No
          commissions, no hidden fees. We&apos;re just the bulletin board - all
          arrangements are made directly between you and the other party.
        </p>
        <Link href="/pricing" className="text-primary hover:underline font-medium">
          View full pricing details →
        </Link>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to join?
        </h2>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary">
            Create Free Account
          </Link>
          <Link href="/jobs" className="btn-outline">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
