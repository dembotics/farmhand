'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function BillingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [managingBilling, setManagingBilling] = useState(false);

  const handleManageBilling = async () => {
    setManagingBilling(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setManagingBilling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted" />
          <p className="text-muted mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const isSubscribed = profile?.is_subscribed;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">Billing & Payments</h1>

      {/* Subscription Status */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${isSubscribed ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isSubscribed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-muted" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {isSubscribed ? 'Poster Plan' : 'Free Plan'}
            </h2>
            <p className="text-muted mt-1">
              {isSubscribed
                ? 'You have full access to post listings and send messages.'
                : 'Upgrade to post listings and send messages first.'}
            </p>
            {isSubscribed && (
              <p className="text-sm text-muted mt-2">
                $15/month - Renews automatically
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="font-semibold text-foreground mb-4">Manage Subscription</h3>

        {isSubscribed ? (
          <div className="space-y-4">
            <p className="text-muted text-sm">
              Use the Stripe billing portal to update your payment method, view invoices, or cancel your subscription.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={managingBilling}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {managingBilling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening portal...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Manage Billing
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted text-sm">
              Subscribe to the Poster plan to unlock all features.
            </p>
            <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              View Pricing
            </Link>
          </div>
        )}
      </div>

      {/* What's Included */}
      {!isSubscribed && (
        <div className="card mt-6">
          <h3 className="font-semibold text-foreground mb-4">What you get with Poster Plan</h3>
          <ul className="space-y-2 text-muted">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Post unlimited job listings
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              List equipment for rent
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              List land for rent
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Sell products & supplies
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              List your services
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Send messages first
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
