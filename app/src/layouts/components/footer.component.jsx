import { Link} from "react-router-dom";
import {
  BookOpen,
  HelpCircle,
  Github,
  Twitter,
  Mail,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "PDF Source",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Guidelines", href: "/guidelines" },
        { label: "API Documentation", href: "/api-docs" },
        { label: "Status", href: "/status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Copyright", href: "/copyright" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Twitter", href: "https://twitter.com", icon: Twitter },
        { label: "GitHub", href: "https://github.com", icon: Github },
        { label: "Email", href: "mailto:info@libraryhub.com", icon: Mail },
        { label: "Support", href: "/support", icon: HelpCircle },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                PDF Source
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Your digital gateway to knowledge. Discover, read, and share books
              from our extensive collection.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="mailto:info@libraryhub.com"
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-gray-800 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => {
                  const Icon = link.icon;
                  return (
                    <li key={linkIdx}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} PDF Source. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
