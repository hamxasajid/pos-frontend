import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ShoppingBag } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, user } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/pos');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-2xl mb-4 text-white shadow-lg shadow-blue-500/40">
                        <ShoppingBag size={40} />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your POS terminal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }}
                        placeholder="admin@pos.com"
                        required
                        error={error}
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" className="w-full py-3" variant="primary">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
