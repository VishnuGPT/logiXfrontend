import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import prakashImg from "../assets/IMG-20260202-WA0021.jpg";
import ShreyaImg from "../assets/Screenshot 2026-02-14 212007.png";
import VishnuImg from "../assets/Screenshot 2026-02-14 220551.png";
import AmitImg from "../assets/Screenshot 2026-02-14 222307.png";
const teamMembers = [
  {
    name: "Prakash Jha",
    role: "Founder",
    bio: "Leading LogiXJunction with a vision to modernize India's freight ecosystem through technology and data-driven logistics.",
    image: prakashImg,
    email: "p.jha@logixjunction.com",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Shreya Jalan",
    role: "Product Manager",
    bio: "Final year student at NSUT (ICE), interested in user growth, strategy and analysis.",
    image: ShreyaImg,
    linkedin: "https://www.linkedin.com/in/shreyaa-jalan/",
    email: "shreyaa.jalan1712@gmail.com",
  },
  {
    name: "Amit Kumar",
    role: "CTO",
    bio: "Student at IIT Kanpur, passionate about Artificial Intelligence, Machine Learning, and full-stack development.",
    image: AmitImg,
    linkedin: "https://www.linkedin.com/in/amit-kumar-38347028a/",
    github: "https://github.com/amitkmr23",
    email: "amitkmr23@iitk.ac.in",
  },
  {
    name: "Vishnu Gupta",
    role: "CTO",
    bio: "3rd year student at NSUT(Meev). Interested in Tech and Non-Tech(Not core!)",
    image: VishnuImg,
    linkedin: " https://www.linkedin.com/in/vishnu-gupta-bab866289/",
    email: "vishnugpt21@gmail.com",
  },

];

export default function LogixAbout() {
  return (
    <div className="bg-gray-50">

      {/* ===== About Section ===== */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          About LogiXJunction
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          LogiXJunction is redefining how freight moves across India. In a sector
          often burdened by inefficiencies, delays, and lack of transparency, we
          provide a technology-first platform that simplifies logistics for both
          shippers and transporters.
        </p>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Our mission is to create a smarter, faster, and more reliable freight
          ecosystem, where businesses can ship goods without hassles and carriers
          can grow through steady demand and fair opportunities.
        </p>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Behind LogiXJunction is a diverse and dynamic team of engineers,
          designers, and operations experts working together to solve real
          logistics challenges.
        </p>

        <p className="text-gray-600 leading-relaxed">
          Driven by our core values of innovation, reliability, and collaboration,
          we aim to modernize logistics in India and set new benchmarks for how
          freight should move in the 21st century.
        </p>
      </section>

      {/* ===== Team Section ===== */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-500 mb-12">
            The people building the future of logistics at LogiXJunction
          </p>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition h-full flex flex-col"
              >
                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
                />

                {/* Name & Role */}
                <h3 className="text-lg font-semibold text-center">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 text-center mb-2">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-gray-600 text-sm text-center mb-4">
                  {member.bio}
                </p>
                {/* Contact Section */}
                <div className="mt-auto text-center space-y-2">

                  {/* Email (text visible) */}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-blue-600 hover:underline break-words block"
                    >
                      {member.email}
                    </a>
                  )}

                  {/* Social Icons */}

                  <div className="flex justify-center gap-5 text-xl text-gray-600 mt-2">

                    {/* LinkedIn */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        className="hover:text-blue-700 transition"
                      >
                        <FaLinkedin />
                      </a>
                    )}

                    {/* GitHub */}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        className="hover:text-black transition"
                      >
                        <FaGithub />
                      </a>
                    )}

                    {/* Twitter */}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Twitter"
                        className="hover:text-sky-500 transition"
                      >
                        <FaTwitter />
                      </a>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


