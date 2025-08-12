import React, { ReactNode, useState } from 'react';
import { Home, Users, FileText, Settings, LogOut, Database, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/clients', icon: Users, label: '고객 관리' },
    { path: '/estimates', icon: FileText, label: '견적 관리' },
    { path: '/data', icon: Database, label: '데이터 뷰' },
    { path: '/settings', icon: Settings, label: '설정' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-teal-700 font-bold text-lg">견적마스터</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-teal-700 font-bold text-xl">견적마스터</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${isActive(item.path) 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive(item.path) ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:shadow-sm">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-teal-700 font-bold text-xl">인테리어 견적마스터</h1>
        </div>
        
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  transition-colors duration-150 ease-in-out
                  ${isActive(item.path)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive(item.path) ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <button
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            로그아웃
          </button>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center py-3 px-2 text-xs font-medium
                ${isActive(item.path) ? 'text-teal-700' : 'text-gray-500 hover:text-gray-900'}
              `}
            >
              <item.icon
                className={`h-6 w-6 mb-1 ${
                  isActive(item.path) ? 'text-teal-600' : 'text-gray-400'
                }`}
              />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden h-16 flex items-center px-4 border-b border-gray-200 bg-white shadow-sm">
          <h1 className="text-teal-700 font-bold text-xl">인테리어 견적마스터</h1>
        </div>
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 pt-16 md:pt-0">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;