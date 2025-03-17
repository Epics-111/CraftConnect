import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Privacy = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="privacy-hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">Last updated: Mar 17, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
            <p className="mb-6">
              This Privacy Policy explains how CraftConnect collects, uses, and discloses personal information when you use our platform. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold mb-6">2. Information We Collect</h2>
            <p className="mb-4 font-semibold">Personal Information:</p>
            <ul className="list-disc pl-8 mb-4">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Profile information including age, occupation, and service preferences</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
            </ul>

            <p className="mb-4 font-semibold">Usage Information:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Log data including IP address, browser type, and pages visited</li>
              <li>Device information such as operating system and unique device identifiers</li>
              <li>Service bookings, reviews, and other platform activity</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send service notifications and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize content and experiences</li>
              <li>Monitor and analyze usage patterns and trends</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6">4. Information Sharing</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Service providers who need access to perform work on our behalf</li>
              <li>Other users as necessary (e.g., service providers see customer contact details)</li>
              <li>Legal authorities when required by law or to protect rights and safety</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6">5. Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mb-6">6. Your Data Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Data portability where technically feasible</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6">7. Cookies Policy</h2>
            <p className="mb-6">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-bold mb-6">8. Changes to This Policy</h2>
            <p className="mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
            </p>

            <h2 className="text-2xl font-bold mb-6">9. Contact Us</h2>
            <p className="mb-6">
              If you have questions about this Privacy Policy, please contact us at privacy@craftconnect.com.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;