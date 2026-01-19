'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  { name: 'Browse all listings', free: true, paid: true },
  { name: 'View worker profiles', free: true, paid: true },
  { name: 'Create account & profile', free: true, paid: true },
  { name: 'Receive messages', free: true, paid: true },
  { name: 'Apply to jobs', free: true, paid: true },
  { name: 'Post job listings', free: false, paid: true },
  { name: 'List equipment for rent', free: false, paid: true },
  { name: 'List land for rent', free: false, paid: true },
  { name: 'Sell products & supplies', free: false, paid: true },
  { name: 'List your services', free: false, paid: true },
  { name: 'Send messages first', free: false, paid: true },
  { name: 'Priority in search results', free: false, paid: true },
];

function CanceledBanner() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  if (!canceled) return null;

  return (
    <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center">
      Checkout was canceled. You can try again when ready.
    </div>
  );
}

export default function PricingPage() {
  const { user, profile, loading } = useAuth();
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!user) return;

    setSubscribing(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      alert('Failed to start checkout. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const isSubscribed = profile?.is_subscribed;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Simple, Honest Pricing
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Free to browse and apply. Pay only when you need to post listings.
        </p>
      </div>

      <Suspense fallback={null}>
        <CanceledBanner />
      </Suspense>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Tier */}
        <div className="card border-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Free</h2>
            <p className="text-muted mt-1">For workers and browsers</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-foreground">$0</span>
            <span className="text-muted">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-center gap-3">
                {feature.free ? (
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={feature.free ? 'text-foreground' : 'text-muted'}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
          {!user ? (
            <Link
              href="/auth/signup"
              className="btn-outline w-full text-center block"
            >
              Create Free Account
            </Link>
          ) : (
            <span className="btn-outline w-full text-center block opacity-50 cursor-default">
              Current Plan
            </span>
          )}
        </div>

        {/* Paid Tier */}
        <div className="card border-2 border-primary relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Poster</h2>
            <p className="text-muted mt-1">For farmers & service providers</p>
          </div>
          <div className="mb-2">
            <span className="text-4xl font-bold text-foreground">$15</span>
            <span className="text-muted">/month</span>
          </div>
          <p className="text-sm text-muted mb-6">
            Cancel anytime
          </p>
          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-foreground">{feature.name}</span>
              </li>
            ))}
          </ul>
          {loading ? (
            <button disabled className="btn-primary w-full flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </button>
          ) : !user ? (
            <Link
              href="/auth/signup"
              className="btn-primary w-full text-center block"
            >
              Start Posting
            </Link>
          ) : isSubscribed ? (
            <Link
              href="/account/billing"
              className="btn-primary w-full text-center block"
            >
              Manage Subscription
            </Link>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting checkout...
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-foreground mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-muted">
              Yes. Cancel anytime from your account settings. Your listings stay
              active until the end of your billing period, then they&apos;re hidden
              until you resubscribe.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-foreground mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-muted">
              We accept all major credit cards through Stripe. Your payment info
              is never stored on our servers.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-foreground mb-2">
              Is there a limit to how many listings I can post?
            </h3>
            <p className="text-muted">
              No limits. Post as many jobs, equipment, land, and product listings
              as you need. All included in your subscription.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-foreground mb-2">
              Do you take a cut from deals made on the platform?
            </h3>
            <p className="text-muted">
              No. We never take a percentage of your deals. You pay the flat
              subscription fee and all arrangements are made directly between
              you and the other party. We&apos;re just the bulletin board.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-foreground mb-2">
              What if I only need to post seasonally?
            </h3>
            <p className="text-muted">
              That&apos;s fine! Subscribe when you need it, cancel when you don&apos;t.
              Many farmers subscribe March through October and pause for winter.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to get started?
        </h2>
        <p className="text-muted mb-6">
          Join Alberta&apos;s agricultural community today.
        </p>
        {!user ? (
          <Link href="/auth/signup" className="btn-primary inline-block">
            Create Your Account
          </Link>
        ) : !isSubscribed ? (
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {subscribing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting checkout...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
