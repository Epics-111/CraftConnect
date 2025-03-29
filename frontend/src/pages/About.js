import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUsers, FaLightbulb, FaHandshake } from "react-icons/fa";

// Replace image imports with placeholder URLs
const teamMembers = [
  {
    name: "Mohammad Ammar",
    role: "Lead Developer",
    image: "/team/Mohammad Ammar.jpg",
    description: "Implemented core features, technical management, and platform architecture."
  },
  {
    name: "Simran",
    role: "Backend Developer",
    image: "/team/Simran.jpg",
    description: "Developed the source code foundation and implemented booking systems."
  },
  {
    name: "Mansi Yadav",
    role: "Project Conceptualist",
    image: "/team/Mansi Yadav.jpg",
    description: "Proposed the initial idea and managed documentation, including README and explanations."
  },
  {
    name: "Sana Yasmine",
    role: "DevOps Engineer",
    image: "/team/Sana Yasmine.jpg",
    description: "Handled deployment processes and AWS infrastructure implementation."
  },
  {
    name: "Simran Gupta",
    role: "Security Specialist",
    image: "/team/Simran Gupta.jpg",
    description: "Implemented authentication systems and security improvements throughout the platform."
  },
  {
    name: "Aparna Yadav",
    role: "Support Developer",
    image: "/team/Aparna Yadav.jpg",
    description: "Provided cross-functional support and contributed to various platform components."
  },
  {
    name: "Aaron Alva",
    role: "UI Designer",
    image: "/team/Aaron Alva.jpg",
    description: "Contributed to platform design elements and visual components."
  },
  {
    name: "Palaskar Urvija Sanjay",
    role: "UX Designer",
    image: "/team/Palaskar Urvija Sanjay.jpg",
    description: "Worked on design concepts and iconography throughout the application."
  },
  {
    name: "Sk Sahil Islam",
    role: "QA Engineer",
    image: "/team/Sk Sahil Islam.jpg",
    description: "Led testing initiatives and quality assurance processes."
  },
];

const About = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="about-hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CraftConnect</h1>
            <p className="text-xl opacity-90 mb-8">Connecting communities with skilled professionals since 2025</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              CraftConnect was founded with a simple yet powerful mission: to bridge the gap between skilled service providers and community members who need their expertise. We believe that everyone deserves access to reliable, high-quality services for their homes and businesses.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform makes it easy to find, book, and pay for services, while also providing service professionals with a steady stream of clients and the tools they need to grow their businesses. We're committed to fostering trust, transparency, and excellence in every interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaUsers className="mx-auto text-5xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p className="text-gray-700">
                We prioritize building strong relationships within communities, connecting neighbors with trusted local professionals.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaLightbulb className="mx-auto text-5xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-gray-700">
                We constantly evolve our platform with new features and tools to make service booking and delivery more efficient.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaHandshake className="mx-auto text-5xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Trust & Quality</h3>
              <p className="text-gray-700">
                We verify all service providers and encourage reviews to maintain high standards of service quality.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Team</h2>
            <p className="text-lg text-gray-700 text-center mb-12">
              CraftConnect is built by a passionate team of innovators, designers, and community advocates who are committed to transforming how services are delivered.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member text-center">
                  <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full shadow-lg">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-indigo-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;