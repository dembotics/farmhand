import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null;

export const stripe = {
  get instance() {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }
    return _stripe;
  }
};

export function getStripeServer() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
