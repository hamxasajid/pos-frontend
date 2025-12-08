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
    const { cartItems, discount, loading } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { total, subtotal, tax } = calculateTotal(cartItems, discount);

    // State
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountTendered, setAmountTendered] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const change = amountTendered ? parseFloat(amountTendered) - total : 0;

    const handlePayment = async () => {
        if (paymentMethod === 'cash' && parseFloat(amountTendered) < total) {
            toast.error('Insufficient amount');
            return;
        }

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
        setAmountTendered('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Process Payment">
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Payable</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 ring-1 ring-blue-500'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Banknote size={24} />
                            <span className="font-semibold">Cash</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 ring-1 ring-blue-500'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <CreditCard size={24} />
                            <span className="font-semibold">Card</span>
                        </button>
                    </div>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <Input
                            label="Amount Tendered"
                            type="number"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            placeholder="0.00"
                            autoFocus
                        />
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400">Change</span>
                            <span className={`font-bold text-xl ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {formatCurrency(change > 0 ? change : 0)}
                            </span>
                        </div>
                    </div>
                )}

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
