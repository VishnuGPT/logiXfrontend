import React from "react";

export default function CookiePolicy() {
  return (
    <section className="bg-background py-16 px-6">
      <div className="flex justify-center items-center">
        <div className="space-y-8 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings text-center">
            Cookie Policy
          </h2>

          <div className="space-y-6 text-lg text-text/80 leading-relaxed">
            <p>
              This Cookie Policy explains how <strong>LogiXjunction</strong>
              uses cookies and similar technologies when you visit our website
              or use our mobile application (“Services”). It also explains how
              you can manage or disable cookies.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              1. What Are Cookies?
            </h3>
            <p>
              Cookies are small text files stored on your device by websites you
              visit. They help websites remember your preferences and improve
              your browsing experience.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              2. Types of Cookies We Use
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for core site
                functionality such as login and checkout.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences,
                language, and location settings.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors interact with our site to improve performance.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> Used to show relevant ads
                (only with your consent).
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              3. How We Use Cookies
            </h3>
            <p>
              We use cookies to ensure website functionality, personalize
              content, measure traffic, and enhance the user experience. We may
              also use third-party cookies for analytics or marketing purposes.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              4. Managing Cookies
            </h3>
            <p>
              You can manage or delete cookies using your browser settings.
              Please note that disabling cookies may affect certain features of
              our website.  
              <br />
              <span className="italic">
                Links to manage cookies in popular browsers:
              </span>
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Safari
                </a>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              5. Updates to This Cookie Policy
            </h3>
            <p>
              We may update this Cookie Policy periodically to reflect changes
              in technology or regulations. The latest version will always be
              available on our website.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              6. Contact Us
            </h3>
            <p>
              For questions or concerns about this Cookie Policy, contact us at{" "}
              <a
                href="mailto:privacy@logixjunction.com"
                className="text-primary underline"
              >
                privacy@logixjunction.com
              </a>
              .
            </p>

            <p className="pt-4 text-sm text-text/60">
              <em>Last Updated: November 2025</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
