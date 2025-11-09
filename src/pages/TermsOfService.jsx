import React from "react";

export default function TermsOfService() {
  return (
    <section className="bg-background py-16 px-6">
      <div className="flex justify-center items-center">
        <div className="space-y-8 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings text-center">
            Terms of Service
          </h2>

          <div className="space-y-6 text-lg text-text/80 leading-relaxed">
            <p>
              Welcome to <strong>LogiXjunction</strong>! These Terms of Service
              (“Terms”) govern your access to and use of our website, mobile
              application, and logistics services (collectively referred to as
              “Services”). By using our Services, you agree to comply with these
              Terms. Please read them carefully.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using LogiXjunction’s Services, you confirm that
              you are at least 18 years old and agree to be bound by these
              Terms, our Privacy Policy, and Cookie Policy.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              2. Use of Services
            </h3>
            <p>
              You agree to use our Services only for lawful purposes and in
              compliance with all applicable laws. You must not misuse or
              attempt to gain unauthorized access to any part of our system,
              network, or data.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              3. Account Registration
            </h3>
            <p>
              To use certain features, you may need to create an account. You
              are responsible for maintaining the confidentiality of your login
              credentials and for all activities under your account. Please
              notify us immediately if you suspect unauthorized access.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              4. Shipment Terms
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All shipments must comply with applicable transport and safety
                laws.
              </li>
              <li>
                LogiXjunction is not responsible for prohibited or restricted
                items shipped through our network.
              </li>
              <li>
                Delivery timelines are estimates and may vary due to unforeseen
                circumstances.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              5. Fees and Payments
            </h3>
            <p>
              You agree to pay all applicable fees and charges for the Services
              used. Payments are processed securely through our verified payment
              partners. We do not store sensitive payment details.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              6. Limitation of Liability
            </h3>
            <p>
              LogiXjunction shall not be liable for indirect, incidental, or
              consequential damages arising out of your use or inability to use
              our Services. Our total liability is limited to the amount you
              paid for the specific service in question.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              7. Intellectual Property
            </h3>
            <p>
              All content, branding, and software on our website and application
              are the intellectual property of LogiXjunction. You may not copy,
              modify, or distribute them without our written permission.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              8. Termination
            </h3>
            <p>
              We reserve the right to suspend or terminate your account or
              access to our Services if you violate these Terms or misuse our
              platform in any way.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              9. Governing Law
            </h3>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India. Any disputes shall be subject to the jurisdiction
              of the courts in [Your City], India.
            </p>

            <h3 className="text-2xl font-semibold text-headings pt-6">
              10. Contact Us
            </h3>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@logixjunction.com"
                className="text-primary underline"
              >
                support@logixjunction.com
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
