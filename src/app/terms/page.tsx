export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none text-muted space-y-6">
        <p className="text-sm text-muted">Last updated: January 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using FarmHand (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p>
            FarmHand is an online platform that connects farmers, agricultural workers, and
            service providers in Alberta. We provide a venue for users to post and browse:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Job listings and worker profiles</li>
            <li>Equipment rental listings</li>
            <li>Land rental listings</li>
            <li>Products and supplies for sale</li>
            <li>Agricultural service provider listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. FarmHand is a Platform Only</h2>
          <p>
            <strong>Important:</strong> FarmHand is a platform that facilitates connections between
            users. We do not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Employ any workers listed on the platform</li>
            <li>Own any equipment, land, or products listed</li>
            <li>Provide any agricultural services</li>
            <li>Guarantee the quality, safety, or legality of listings</li>
            <li>Verify the accuracy of user-provided information</li>
            <li>Mediate disputes between users</li>
          </ul>
          <p className="mt-4">
            All transactions, agreements, and arrangements are made directly between users.
            FarmHand is not a party to any agreement between users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide accurate information in your profile and listings</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not post fraudulent, misleading, or illegal content</li>
            <li>Conduct your own due diligence before entering agreements</li>
            <li>Handle all employment, rental, and sales agreements directly</li>
            <li>Maintain appropriate insurance and licenses for your activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Subscriptions and Payments</h2>
          <p>
            Posting listings requires a paid subscription. Subscriptions are billed monthly or
            annually. You may cancel at any time, and your subscription will remain active until
            the end of the current billing period. We do not offer refunds for partial months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            FarmHand is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Any damages arising from use of the platform</li>
            <li>Disputes between users</li>
            <li>Loss of income, equipment damage, or injuries</li>
            <li>Actions or conduct of other users</li>
            <li>Accuracy or completeness of listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or
            for any other reason at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the Service after
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Contact</h2>
          <p>
            Questions about these terms? Contact us at{' '}
            <a href="mailto:support@farmhand.ca" className="text-primary hover:underline">
              support@farmhand.ca
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
