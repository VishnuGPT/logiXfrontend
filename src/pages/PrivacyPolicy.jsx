import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="bg-background py-16 px-6">
      <div className="flex justify-center items-center">
        <div className="space-y-8 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings text-center">
            Privacy Policy
          </h2>

          <div className="space-y-6 text-lg text-text/80 leading-relaxed">
            <p>
              We at <strong>LogiXjunction</strong> (“we”, “us”, “our”) value
              your trust and are committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your personal information when you use our website,
              mobile application, or logistics services (“Services”).
            </p>

            <p>
              By accessing or using our Services, you agree to the collection
              and use of information in accordance with this Policy. Please read
              this Privacy Policy carefully before using our Services.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              1. Definitions
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Consignor:</strong> The person, company, or entity that
                ships goods using LogiXjunction’s Services.
              </li>
              <li>
                <strong>Consignee:</strong> The recipient or buyer of the
                shipment.
              </li>
              <li>
                <strong>Data Subject:</strong> Any individual identifiable by
                name, contact information, ID number, or other identifiers.
              </li>
              <li>
                <strong>Third Party Vendors:</strong> Service providers,
                partners, or contractors engaged by LogiXjunction to perform
                delivery, payment, analytics, or communication functions.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              2. What Data Do We Collect?
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity and contact details (name, email, phone, etc.)</li>
              <li>Shipment and tracking details</li>
              <li>Payment and billing information</li>
              <li>Technical and location data for improving user experience</li>
            </ul>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              3. When and How Do We Collect Data?
            </h3>
            <p>
              We collect data when you register, place or receive shipments,
              contact us, or browse our website. We may also collect data from
              third parties such as logistics partners or payment processors.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              4. Why Do We Collect Your Data?
            </h3>
            <p>
              We collect your data to operate and improve our logistics
              services, process shipments, ensure compliance, and provide
              customer support. Your data also helps us improve user experience
              and prevent fraud or misuse.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              5. Data Sharing and Disclosure
            </h3>
            <p>
              We may share your data with verified partners, delivery agents,
              and legal authorities where necessary. All third parties follow
              strict confidentiality and security obligations.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              6. Data Retention
            </h3>
            <p>
              We retain your personal data only as long as necessary to fulfill
              the purposes stated or as required by law. Once no longer needed,
              the data is securely deleted or anonymized.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              7. Security Measures
            </h3>
            <p>
              LogiXjunction employs encryption, secure servers, and
              role-based access controls to protect your information. While we
              take every precaution, no online system is entirely secure.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              8. Children’s Privacy
            </h3>
            <p>
              Our Services are not intended for individuals under 18 years of
              age. We do not knowingly collect data from minors. If you believe
              a minor has provided us personal data, contact us for removal.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              9. Your Rights
            </h3>
            <p>
              You have the right to access, correct, delete, or withdraw consent
              for your personal data. You can request these actions by emailing
              us at{" "}
              <a
                href="mailto:privacy@logixjunction.com"
                className="text-primary font-medium underline"
              >
                privacy@logixjunction.com
              </a>
              .
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              10. Updates to This Policy
            </h3>
            <p>
              We may update this Privacy Policy periodically. The latest version
              will always be posted on our website. Continued use of our
              Services constitutes acceptance of these updates.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              11. Contact Us
            </h3>
            <p>
              If you have any questions about this Privacy Policy or your
              personal data, please contact us at{" "}
              <a
                href="mailto:support@logixjunction.com"
                className="text-primary font-medium underline"
              >
                support@logixjunction.com
              </a>{" "}
              or visit our website at{" "}
              <a
                href="https://www.logixjunction.com"
                className="text-primary font-medium underline"
                target="_blank"
                rel="noreferrer"
              >
                www.logixjunction.com
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
