import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productSlice';
import { fetchCategories } from '../../redux/categorySlice';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import CartSidebar from '../../components/CartSidebar';
import CheckoutModal from '../../components/CheckoutModal';
import { Search, ShoppingBag } from 'lucide-react';

const POS = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector(state => state.products);
    const { categories } = useSelector(state => state.categories);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    // Cart state
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Derived state for cart badge
    const { cartItems } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide focus:outline-none">
                {/* Header / Filter */}
                <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-md px-6 pt-6 pb-4 mb-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex justify-between w-full sm:w-auto items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
                                <p className="text-gray-500 dark:text-gray-400">Choose category and select products</p>
                            </div>
                            {/* Mobile Cart Toggle */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="lg:hidden p-3 bg-blue-600 text-white rounded-xl shadow-lg relative active:scale-95 transition-transform"
                                aria-label="Open Cart"
                            >
                                <ShoppingBag size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            <input
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-gray-900 dark:text-white"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={`px-5 py-2 rounded-xl whitespace-nowrap font-medium transition-all duration-200 border cursor-pointer ${activeCategory === 'All'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id || category._id || category.name || category}
                                onClick={() => setActiveCategory(category.name || category)}
                                className={`px-5 py-2 rounded-xl whitespace-nowrap font-medium transition-all duration-200 border cursor-pointer ${activeCategory === (category.name || category)
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {category.name || category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-20">
                    {loading ? (
                        Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No products found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* Logic */}
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </div>
    );
};

export default POS;
