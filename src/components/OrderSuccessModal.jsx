import React, { useRef } from 'react';
import Modal from './Modal';
import Button from './Button';
import { CheckCircle, Printer } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useReactToPrint } from 'react-to-print';

const Receipt = React.forwardRef(({ order }, ref) => {
    if (!order) return null;

    return (
        <div ref={ref} className="p-8 bg-white text-black font-mono text-sm" style={{ width: '80mm', minHeight: '100mm', margin: '0 auto' }}>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold uppercase mb-2">ModernPOS Store</h2>
                <p className="text-xs text-gray-500">123 Main Street, City, Country</p>
                <p className="text-xs text-gray-500">Tel: +1 234 567 890</p>
            </div>

            <div className="border-b border-dashed border-gray-400 pb-4 mb-4">
                <p>Order #: {order._id ? order._id.slice(-6).toUpperCase() : '------'}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Cashier: {order.cashierId?.name || 'Unknown'}</p>
                <p>Pay Method: {order.paymentMethod.toUpperCase()}</p>
            </div>

            <div className="mb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-400">
                            <th className="py-1">Item</th>
                            <th className="py-1 text-right">Qty</th>
                            <th className="py-1 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-1 max-w-[40mm] truncate">{item.name}</td>
                                <td className="py-1 text-right">{item.quantity}</td>
                                <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-4 space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                    <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-gray-400">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(order.total)}</span>
                </div>
            </div>

            <div className="text-center mt-8 pt-4 border-t border-gray-400">
                <p className="font-bold">Thank You!</p>
                <p className="text-xs mt-1">Please visit again</p>
            </div>
            {/* Logic for print hide/show */}
            <style type="text/css" media="print">
                {`@page { size: auto; margin: 0mm; } body { background-color: white; }`}
            </style>
        </div>
    );
});

const OrderSuccessModal = ({ isOpen, onClose, order }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Receipt-${order?._id}`,
    });

    if (!order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Order Successful">
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Received</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Total Amount: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                </p>

                <div className="flex flex-col w-full gap-3">
                    <Button variant="primary" className="w-full py-3 flex items-center justify-center gap-2" onClick={handlePrint}>
                        <Printer size={20} />
                        Print Receipt
                    </Button>
                    <Button variant="secondary" className="w-full py-3" onClick={onClose}>
                        Close & New Order
                    </Button>
                </div>

                {/* Hidden Receipt for Printing - using absolute positioning to keep it in DOM for ref */}
                <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '80mm' }}>
                    <Receipt ref={componentRef} order={order} />
                </div>
            </div>
        </Modal>
    );
};

export default OrderSuccessModal;
