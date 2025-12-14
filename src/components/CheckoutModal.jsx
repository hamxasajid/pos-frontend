import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { calculateTotal, formatCurrency } from '../utils/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, createOrder } from '../redux/cartSlice';
import { fetchProducts } from '../redux/productSlice';
import { CheckCircle, Printer, CreditCard, Banknote, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderSuccessModal from './OrderSuccessModal';

const CheckoutModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { cartItems, discount, loading, includeTax } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { total, subtotal, tax } = calculateTotal(cartItems, discount, includeTax);

    // State
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Keeping for backend field compatibility
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const handlePayment = async () => {
        // Validation removed as we are not taking amount tendered anymore
        // Defaulting to 'cash' for now or we can hardcode as 'generic'
        // const paymentMethod = 'cash'; // already in state default

        const orderData = {
            items: cartItems.map(item => ({
                productId: item.id || item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
            userId: user.id
        };

        const result = await dispatch(createOrder(orderData));
        if (createOrder.fulfilled.match(result)) {
            setLastOrder(result.payload);
            setIsSuccessModalOpen(true); // Open Success Modal
            dispatch(fetchProducts()); // Refresh stock
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        setLastOrder(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Process Payment">
            <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 max-h-60 overflow-y-auto custom-scrollbar">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Order Summary</h3>
                    <div className="space-y-2">
                        {cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex-1">
                                    <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                                    <div className="text-xs text-gray-500">{formatCurrency(item.price)} x {item.quantity}</div>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Display */}
                <div className="flex justify-between items-center bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-900/50">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Payable</span>
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(total)}</span>
                </div>

                <Button variant="primary" onClick={handlePayment} disabled={loading} className="w-full py-3 text-lg flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : `Pay ${formatCurrency(total)}`}
                </Button>
            </div>

            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessClose}
                order={lastOrder}
            />
        </Modal>
    );
};

export default CheckoutModal;
