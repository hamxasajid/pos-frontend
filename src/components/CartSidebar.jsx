import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart, toggleTax } from '../redux/cartSlice';
import { Trash2, Plus, Minus, Receipt, X, ShoppingBag } from 'lucide-react';
import { calculateTotal, formatCurrency } from '../utils/helpers';
import Button from './Button';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
    const dispatch = useDispatch();
    const { cartItems, discount, includeTax } = useSelector(state => state.cart);

    const { subtotal, tax, total } = useMemo(() => calculateTotal(cartItems, discount, includeTax), [cartItems, discount, includeTax]);

    return (
        <>
            {/* Overlay for mobile/tablet when open */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    } lg:hidden`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 
        border-l border-gray-200 dark:border-gray-800 shadow-2xl 
        transform transition-transform duration-300 ease-in-out
        flex flex-col h-full
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} 
        lg:relative lg:translate-x-0 lg:z-30 lg:shadow-none lg:border-l
      `}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Receipt size={24} className="text-primary-600" />
                        Current Order
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-bold px-3 py-1 rounded-full">
                            {cartItems.length} Items
                        </span>
                        {/* Close button - visible on small screens */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                            <ShoppingBag size={64} className="opacity-20" />
                            <p className="font-medium">No items in cart</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 group">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                                    <p className="text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(item.price)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
                                        <button onClick={() => dispatch(decrementQuantity(item.id))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300">
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                                        <button onClick={() => dispatch(incrementQuantity(item.id))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-400 hover:text-red-500 transition-colors p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 space-y-3 pb-8 flex-shrink-0">
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 pb-4 border-b border-dashed border-gray-300 dark:border-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={includeTax}
                                    onChange={() => dispatch(toggleTax())}
                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-gray-600 dark:text-gray-400">Service Charges (10%)</span>
                            </label>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span className="font-semibold">-{formatCurrency(discount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" onClick={() => dispatch(clearCart())} className="border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onCheckout}
                            disabled={cartItems.length === 0}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
