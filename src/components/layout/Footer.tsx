import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl text-foreground">FarmHand</span>
            </div>
            <p className="text-sm text-muted">
              Connecting Alberta&apos;s agricultural community.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted hover:text-foreground">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/workers" className="text-muted hover:text-foreground">
                  Workers
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-muted hover:text-foreground">
                  Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/land" className="text-muted hover:text-foreground">
                  Land
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-foreground">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} FarmHand. Built by Dembotics.</p>
        </div>
      </div>
    </footer>
  );
}
