import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Home,
  Upload,
  Menu,
  Bell,
  Search,
} from 'lucide-react';
import UserDropdown from './components/userdropdown.component';
import ScrollToTop from './components/scroll-to-top.component';
import MobileMenu from './components/mobile-menu.component';
import Footer from './components/footer.component';

const RootLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if current page has its own custom navbar
  const hasCustomNavbar = location.pathname === '/book/:id' || location.pathname.startsWith('/reader');
  
  // Navigation Items
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    // { path: '/library', label: 'Library', icon: Library },
    { path: '/upload', label: 'Upload', icon: Upload },
    // { path: '/trending', label: 'Trending', icon: TrendingUp },
    // { path: '/community', label: 'Community', icon: Users },
    // { path: '/leaderboard', label: 'Leaderboard', icon: Award }
  ];
  
  // Scroll handler for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Site Navbar - Hidden on pages with custom navbar */}
      {!hasCustomNavbar && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-lg shadow-md"
              : "bg-white shadow-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  PDF Source
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.path}
                    className={({ isActive }) => `
                      relative px-4 py-2 rounded-lg transition-colors
                      ${
                        isActive
                          ? "text-emerald-600"
                          : "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-emerald-600 after:transition-transform after:duration-300 hover:after:scale-x-100 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button className="hidden md:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="hidden md:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Dropdown */}
                <div className="hidden md:block">
                  <UserDropdown />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Slot for Page-Specific Custom Navbar */}
      {hasCustomNavbar && (
        <div className="sticky top-0 z-40">
          <Outlet context={{}} />
        </div>
      )}

      {/* Main Content */}
      <main className={!hasCustomNavbar ? "pt-16" : ""}>
        <div
          className={
            !hasCustomNavbar
              ? "max-w-7xl bg-linear-to-br from-gray-50 to-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-8"
              : ""
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer - Hide on pages with custom navbar that might want their own footer */}
      {!hasCustomNavbar && <Footer />}

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </div>
  );
};

// Custom Navbar Slot Component (for pages that need their own navbar)
export const CustomNavbarSlot = ({ children }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      {children}
    </div>
  );
};

export default RootLayout;
