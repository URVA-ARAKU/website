import React from 'react';
import { 
  FaBox, 
  FaClipboardList, 
  FaMoneyCheckAlt, 
  FaTachometerAlt, 
  FaTimes, 
  FaUsers, 
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaStar,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaQrcode
} from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isSidebarOpen, 
  toggleSidebar, 
  isCollapsed, 
  toggleCollapse 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('vh_admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/admin/banners', label: 'Banners & Campaigns', icon: FaImage },
    { to: '/admin/products', label: 'Products Catalog', icon: FaBox },
    { to: '/admin/featured', label: 'Featured Items', icon: FaStar },
    { to: '/admin/orders', label: 'Orders', icon: FaClipboardList },
    { to: '/admin/transactions', label: 'UPI Payments & Proofs', icon: FaQrcode },
    { to: '/admin/customers', label: 'Customers', icon: FaUsers },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: FaMoneyCheckAlt },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } w-64 bg-[#3F2618] text-[#F4F1EA] ${
          isCollapsed ? 'p-3' : 'p-5'
        } flex flex-col justify-between border-r border-[#5A3825] shadow-2xl z-40 transform transition-all duration-300 ease-in-out md:translate-x-0 font-sans ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end mb-2">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-lg text-[#F4F1EA]/80 hover:text-white hover:bg-[#5A3825] transition"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          {/* Brand Header */}
          <div className={`mb-6 pb-5 border-b border-[#5A3825] ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <Link 
                to="/admin/dashboard" 
                onClick={() => { if (isSidebarOpen) toggleSidebar(); }} 
                className="group block"
                title="URVA Admin Dashboard"
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F4] p-1 flex items-center justify-center border border-[#5A3825] shadow-xs shrink-0">
                    <img
                      src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png"
                      alt="URVA Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {!isCollapsed && (
                    <div>
                      <h1 className="text-base font-serif font-bold text-[#F4F1EA] tracking-tight group-hover:text-white transition-colors leading-tight">
                        URVA
                      </h1>
                      <span className="text-[10px] text-[#C8BCAB] tracking-[0.2em] uppercase font-semibold block mt-0.5">
                        Admin Console
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Desktop toggle button in header when expanded */}
              {!isCollapsed && (
                <button
                  onClick={toggleCollapse}
                  className="hidden md:flex p-1.5 rounded-lg text-[#F4F1EA]/80 hover:text-white hover:bg-[#5A3825] transition"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <FaChevronLeft size={13} />
                </button>
              )}
            </div>
            
            {/* Quick link to storefront */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3.5 relative group flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl bg-[#2E1C13] hover:bg-[#5A3825] text-[11px] text-[#F4F1EA]/90 hover:text-white transition border border-[#5A3825]`}
              title="View Live Store"
            >
              {isCollapsed ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <div className="hidden md:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 bg-[#2E1C13] text-[#F4F1EA] text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#5A3825] pointer-events-none items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>View Live Store</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>View Live Store</span>
                  </span>
                  <FaExternalLinkAlt className="text-[10px] text-[#C8BCAB] group-hover:text-white transition" />
                </>
              )}
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {!isCollapsed ? (
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#C8BCAB]">
                Store Management
              </p>
            ) : (
              <div className="w-6 h-px bg-[#5A3825] mx-auto my-2" />
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => { if (isSidebarOpen) toggleSidebar(); }}
                  className={({ isActive }) =>
                    `relative group flex items-center ${
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                    } rounded-xl transition-all duration-200 text-xs font-medium ${
                      isActive
                        ? 'bg-[#8B5A2B] text-white font-semibold shadow-xs'
                        : 'text-[#F4F1EA]/80 hover:bg-[#5A3825] hover:text-white'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`${isCollapsed ? 'text-base' : 'text-sm'} shrink-0`} />
                  {!isCollapsed && <span>{item.label}</span>}

                  {/* Floating tooltip when collapsed */}
                  {isCollapsed && (
                    <div className="hidden md:group-hover:flex absolute left-full ml-3 px-3 py-1.5 bg-[#2E1C13] text-[#F4F1EA] text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#5A3825] pointer-events-none items-center">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account section */}
        <div className="pt-4 border-t border-[#5A3825] space-y-2 shrink-0">
          <div
            className={`relative group ${
              isCollapsed ? 'flex justify-center p-2' : 'px-3 py-2 flex items-center gap-3'
            } rounded-xl bg-[#2E1C13] border border-[#5A3825]`}
          >
            <div className="w-8 h-8 rounded-full bg-[#8B5A2B] text-white font-bold flex items-center justify-center text-xs border border-[#5A3825] shrink-0">
              UR
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#F4F1EA] truncate">Administrator</p>
                <p className="text-[10px] text-[#C8BCAB] truncate">Store Manager</p>
              </div>
            )}
            {isCollapsed && (
              <div className="hidden md:group-hover:flex absolute left-full ml-3 px-3 py-1.5 bg-[#2E1C13] text-[#F4F1EA] text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#5A3825] pointer-events-none items-center">
                Administrator
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`relative group flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
            } rounded-xl transition duration-200 text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 w-full`}
            title="Sign Out"
          >
            <FaSignOutAlt className="text-xs shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
            {isCollapsed && (
              <div className="hidden md:group-hover:flex absolute left-full ml-3 px-3 py-1.5 bg-[#2E1C13] text-red-300 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#5A3825] pointer-events-none items-center">
                Sign Out
              </div>
            )}
          </button>

          {/* Desktop collapse / expand toggle bar */}
          <button
            onClick={toggleCollapse}
            className={`hidden md:flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-[#F4F1EA]/80 hover:text-white hover:bg-[#5A3825] transition-colors text-xs font-medium w-full border border-[#5A3825] mt-1`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <FaChevronRight className="text-xs" />
            ) : (
              <>
                <span className="text-[11px] text-[#C8BCAB]">Collapse Menu</span>
                <FaChevronLeft className="text-xs text-[#C8BCAB]" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;


