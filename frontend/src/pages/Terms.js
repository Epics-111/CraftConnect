import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Terms = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="terms-hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90">Last updated: Mar 17, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing or using the CraftConnect platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>

            <h2 className="text-2xl font-bold mb-6">2. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="mb-6">
              You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>

            <h2 className="text-2xl font-bold mb-6">3. Service Bookings</h2>
            <p className="mb-4">
              CraftConnect facilitates connections between service providers and customers. We are not responsible for the actual services performed.
            </p>
            <p className="mb-6">
              All bookings made through our platform constitute a contract between you and the service provider. While we vet our providers, we cannot guarantee the quality of all services performed.
            </p>

            <h2 className="text-2xl font-bold mb-6">4. Payments and Fees</h2>
            <p className="mb-4">
              Service providers set their own rates. CraftConnect charges a platform fee on each transaction which is clearly displayed before booking confirmation.
            </p>
            <p className="mb-6">
              All payments are processed securely through our payment processors. We do not store credit card information on our servers.
            </p>

            <h2 className="text-2xl font-bold mb-6">5. Cancellation Policy</h2>
            <p className="mb-6">
              Cancellations made more than 24 hours before the scheduled service time may receive a full refund. Cancellations within 24 hours are subject to the service provider's cancellation policy and may incur fees.
            </p>

            <h2 className="text-2xl font-bold mb-6">6. Intellectual Property</h2>
            <p className="mb-6">
              The CraftConnect platform and its original content, features, and functionality are owned by CraftConnect and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold mb-6">7. Limitation of Liability</h2>
            <p className="mb-6">
              CraftConnect shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use of or inability to use the service.
            </p>

            <h2 className="text-2xl font-bold mb-6">8. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify these terms at any time. We will provide notice of any significant changes by updating the date at the top of these Terms and by maintaining a link to the previous version.
            </p>

            <h2 className="text-2xl font-bold mb-6">9. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms, please contact us at support@craftconnect.com.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;