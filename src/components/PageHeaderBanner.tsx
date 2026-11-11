import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeaderBanner({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: PageHeaderBannerProps) {
  return (
    <section className="maroon-velvet text-[#FDF7EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-[#ECC572]/90 mb-3"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {eyebrow && (
          <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-[#ECC572] font-semibold mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="heading-section font-display font-bold text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#F8EEDB]/90 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Subtle golden wave bottom */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 36"
          className="w-full h-5 sm:h-7 block"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,18 C480,42 960,0 1440,22 L1440,36 L0,36 Z"
            fill="#D4A143"
            fillOpacity="0.65"
          />
          <path
            d="M0,24 C480,44 960,6 1440,28 L1440,36 L0,36 Z"
            fill="#FDF7EC"
            fillOpacity="0.92"
          />
        </svg>
      </div>
    </section>
  );
}

