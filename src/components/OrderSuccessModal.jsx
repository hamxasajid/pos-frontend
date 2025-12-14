import React, { useRef } from 'react';
import Modal from './Modal';
import Button from './Button';
import { CheckCircle, Printer } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useReactToPrint } from 'react-to-print';
import Receipt from './Receipt';

const OrderSuccessModal = ({ isOpen, onClose, order }) => {
    const componentRef = useRef(null);

    // We construct the print handler but we must ensure ref logic is correct
    const handlePrint = useReactToPrint({
        contentRef: componentRef,  // v3.x uses contentRef instead of content callback
        documentTitle: `Receipt-${order?._id || 'New'}`,
        onPrintError: () => alert('Attach Printer'),
    });

    // If order is null, we can return null for the MODAL, but we have to be careful about hooks.
    // Ideally hooks should run unconditionally.

    return (
        <>
            {/* Always render the receipt hidden in the DOM so the ref is always valid when component is mounted */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <Receipt ref={componentRef} order={order} />
            </div>

            {order && (
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
                    </div>
                </Modal>
            )}
        </>
    );
};

export default OrderSuccessModal;
