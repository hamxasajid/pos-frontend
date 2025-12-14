import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, FileBarChart } from 'lucide-react';

const Sidebar = () => {
    const getLinkClass = ({ isActive }) => {
        return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
            }`;
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 h-full transition-colors duration-300">
            <nav className="p-4 space-y-2">
                <NavLink to="/admin" end className={getLinkClass}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={getLinkClass}>
                    <Package size={20} />
                    Products
                </NavLink>
                <NavLink to="/admin/categories" className={getLinkClass}>
                    <Package size={20} />
                    Categories
                </NavLink>
                <NavLink to="/admin/orders" className={getLinkClass}>
                    <FileBarChart size={20} />
                    Orders History
                </NavLink>
                <NavLink to="/admin/users" className={getLinkClass}>
                    <Users size={20} />
                    Users
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
