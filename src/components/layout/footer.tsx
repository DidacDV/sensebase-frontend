import { motion } from 'framer-motion';
import sensebaseLogo from '../../assets/sensebaseLogo.png';

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        "Platform overview",
        "Data connectors",
        "AI models",
        "Visualization",
        "Integration",
        "API docs"
      ]
    },
    {
      title: "Solutions",
      links: [
        "Energy sector",
        "Analytics",
        "Real-time monitoring",
        "Dashboards",
        "Enterprise",
        "Insights"
      ]
    },
    {
      title: "Resources",
      links: [
        "Documentation",
        "API reference",
        "Tutorials",
        "Case studies",
        "Blog",
        "Community"
      ]
    },
    {
      title: "Company",
      links: [
        "About us",
        "Careers",
        "Contact",
        "Privacy",
        "Terms",
        "Security"
      ]
    }
  ];

  const ctaCards = [
    {
      title: "Get started",
      description: "Create your first intelligent dashboard using our intuitive platform in minutes.",
      buttonText: "Sign up →",
      bgColor: "bg-[#2D2D2D]"
    },
    {
      title: "See Sensebase in action",
      description: "Get an overview of our platform and explore the key features with our interactive demo.",
      buttonText: "Book a demo →",
      bgColor: "bg-[#1A2B3C]",
      highlight: true
    },
    {
      title: "Take a quick tour",
      description: "Walk through a complete use case and discover how Sensebase transforms your data into insights.",
      buttonText: "Show how it works →",
      bgColor: "bg-[#2D2D2D]"
    }
  ];

  return (
    <footer className="bg-[#5BA89D] text-white overflow-hidden">
      {/* CTA Cards Section */}
      <div className="bg-[#3D3D3D] pt-16 pb-16 px-6 rounded-b-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {ctaCards.map((card, idx) => (
              <motion.div
                key={card.title}
                className={`${card.bgColor} rounded-3xl p-8 relative overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {card.description}
                </p>
                <motion.button
                  className={`${
                    card.highlight ? 'bg-[#5BA89D]' : 'bg-white'
                  } ${
                    card.highlight ? 'text-white' : 'text-black'
                  } font-semibold px-6 py-2.5 rounded-full text-sm hover:shadow-lg transition-shadow`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {card.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-[#5BA89D] text-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between mb-12 pb-4">
            <div className="flex flex-wrap gap-6 text-xs">
              <span className="font-semibold">How can we help?</span>
              <a href="#" className="hover:underline">Contact us</a>
              <a href="#" className="hover:underline">Help center</a>
              <a href="#" className="hover:underline">Status</a>
            </div>
            <div className="flex gap-4 items-center mt-4 md:mt-0">
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-[#1A2B3C] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-white text-xs font-bold">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1A2B3C] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-white text-xs font-bold">X</span>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1A2B3C] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-white text-xs font-bold">yt</span>
                </a>
              </div>
              <div className="ml-4 px-4 py-2 bg-[#1A2B3C] rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#2D3D4D] transition-colors">
                <span className="text-white text-xs">🌐</span>
                <span className="text-white text-xs font-semibold">English</span>
                <span className="text-white text-xs">▼</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-xs mb-4 uppercase tracking-wider opacity-70">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm hover:underline transition-all duration-200 hover:translate-x-1 inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Logo */}
      <div className="bg-[#5BA89D] text-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Section */}
          <div className="mb-12 pb-12 border-b border-black border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Stay updated</h3>
                <p className="text-sm opacity-80">Subscribe to our newsletter for the latest insights and updates.</p>
              </div>
              <div className="flex-1 max-w-md w-full">
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A2B3C] text-sm"
                  />
                  <motion.button
                    className="bg-[#1A2B3C] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#2D3D4D] transition-colors whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Logo and Legal */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex items-center gap-3 md:gap-4">
              <img 
                src={sensebaseLogo} 
                alt="Sensebase Logo" 
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
              <h2 className="text-6xl md:text-8xl font-bold tracking-tight">
                sensebase
                <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-[#1A2B3C] rounded-full ml-2 mb-4"></span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm">
              <span className="opacity-70">© 2025 Sensebase</span>
              <a href="#" className="hover:underline">Legal</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Supplier code</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
