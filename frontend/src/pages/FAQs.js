import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQs = () => {
  const faqData = [
    {
      question: "How does CraftConnect work?",
      answer: "CraftConnect connects service providers with customers who need their services. Users can browse through various service categories, select a provider based on ratings and reviews, and book appointments directly through our platform."
    },
    {
      question: "How do I sign up as a service provider?",
      answer: "To sign up as a service provider, create an account on CraftConnect, select the 'Service Provider' option during registration, and complete your profile with details about your services, experience, and hourly rates. Once your profile is reviewed and approved, you'll appear in search results."
    },
    {
      question: "What payment methods do you accept?",
      answer: "CraftConnect accepts major credit and debit cards including Visa, MasterCard, and American Express. We also support payments through PayPal for added convenience and security."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel a booking through your dashboard. Cancellations made more than 24 hours before the scheduled service time receive a full refund. For cancellations within 24 hours, a cancellation fee may apply based on the service provider's policy."
    },
    {
      question: "How are service providers vetted?",
      answer: "All service providers undergo a thorough verification process that includes identity verification, background checks, and verification of professional credentials where applicable. We also maintain a rating and review system that helps ensure quality service."
    },
    {
      question: "What happens if I'm not satisfied with a service?",
      answer: "If you're not satisfied with a service, please contact our customer support within 48 hours of service completion. We have a satisfaction guarantee and will work with you and the service provider to resolve any issues or provide appropriate compensation."
    },
    {
      question: "Are services covered by insurance?",
      answer: "All professional services booked through CraftConnect are covered by our liability insurance policy, which protects against accidental damages that may occur during service delivery. Service providers are also required to maintain their own professional insurance."
    },
    {
      question: "How do I leave a review for a service provider?",
      answer: "After a service is completed, you'll receive an email prompting you to leave a review. You can also log in to your account, go to 'Past Bookings,' and select the 'Leave Review' option for the specific service you want to rate."
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="faq-hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90">Everything you need to know about CraftConnect</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${openIndex === index ? 'bg-indigo-50 rounded-t-lg' : 'bg-gray-50 rounded-lg hover:bg-gray-100'}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  {openIndex === index ? <FaChevronUp className="text-indigo-600" /> : <FaChevronDown className="text-gray-600" />}
                </div>
                {openIndex === index && (
                  <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-700 mb-6">Our support team is ready to help you with any other questions you may have.</p>
            <a 
              href="/contact" 
              className="inline-block bg-indigo-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQs;