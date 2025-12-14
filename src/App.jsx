import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import POS from './pages/POS/POS';
import Dashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import UserList from './pages/Admin/UserList';
import CategoryList from './pages/Admin/CategoryList';
import OrderHistory from './pages/Admin/OrderHistory';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Mobile Sidebar Overlay + Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div className={`
             absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out
             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (Static) */}
        <div className="hidden md:block h-full relative z-30">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto w-full relative p-4 md:p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const PosLayout = () => (
  <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <Navbar />
    <main className="flex-1 overflow-hidden relative">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  // Initialize theme from local storage
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white !border !border-gray-100 dark:!border-gray-800 !shadow-lg',
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* POS Routes - Accessible by Cashier and Admin */}
        <Route element={<PrivateRoute roles={['cashier', 'admin']} />}>
          <Route element={<PosLayout />}>
            <Route path="/pos" element={<POS />} />
          </Route>
        </Route>

        {/* Admin Routes - Accessible by Admin only */}
        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="users" element={<UserList />} />
            {/* Fallback for other requests */}
            <Route path="sales" element={<Dashboard />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="categories" element={<CategoryList />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;