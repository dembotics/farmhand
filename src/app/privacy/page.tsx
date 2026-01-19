export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none text-muted space-y-6">
        <p className="text-sm text-muted">Last updated: January 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Account information (name, email, phone, region)</li>
            <li>Profile information (bio, skills, experience)</li>
            <li>Listings you create (jobs, equipment, land, products, services)</li>
            <li>Messages sent through the platform</li>
            <li>Reviews you write</li>
          </ul>
          <p className="mt-4">We also collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Usage data (pages visited, features used)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Payment information (processed securely by Stripe)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and improve the Service</li>
            <li>Display your profile and listings to other users</li>
            <li>Enable messaging between users</li>
            <li>Process payments</li>
            <li>Send important account notifications</li>
            <li>Respond to support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Information Sharing</h2>
          <p>Your profile and listings are visible to other users of the platform.</p>
          <p className="mt-4">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Service providers (hosting, payment processing, email)</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your data. However, no
            system is completely secure. Use the platform at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h2>
          <p>You can:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access and update your profile information</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of marketing emails</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Cookies</h2>
          <p>
            We use cookies to keep you logged in and understand how you use the platform.
            You can disable cookies in your browser, but some features may not work properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Children</h2>
          <p>
            FarmHand is not intended for users under 18. We do not knowingly collect
            information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We&apos;ll notify you of significant
            changes by email or through the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Contact</h2>
          <p>
            Questions about privacy? Contact us at{' '}
            <a href="mailto:support@farmhand.ca" className="text-primary hover:underline">
              support@farmhand.ca
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
