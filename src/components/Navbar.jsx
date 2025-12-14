import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Sun, Moon, LogOut, ShoppingBag, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import ConfirmationModal from './ConfirmationModal';

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 transition-colors duration-300">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                {/* Mobile Menu Button - Only visible if onMenuClick is provided (Admin Layout) */}
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 mr-2 md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20">
                    <ShoppingBag size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ModernPOS</h1>
            </div>

            <div className="flex items-center gap-6">
                {user && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {user.name} ({user.role})
                    </span>
                )}

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <Button variant="ghost" onClick={() => setIsLogoutModalOpen(true)} className="!px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                message="Are you sure you want to sign out of your account?"
                confirmText="Logout"
            />
        </header>
    );
};

export default Navbar;
