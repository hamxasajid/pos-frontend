import React from 'react';
import { formatCurrency } from '../utils/helpers';

const Receipt = React.forwardRef(({ order }, ref) => {
    // Always render the container div to ensure ref is attached
    // We keep the style here to ensure it prints correctly
    return (
        <div
            ref={ref}
            className="p-8 bg-white text-black font-mono text-sm"
            style={{ width: '80mm', minHeight: '100mm', margin: '0 auto' }}
        >
            {order ? (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold uppercase mb-2">ModernPOS Store</h2>
                        <p className="text-xs text-gray-500">123 Main Street, City, Country</p>
                        <p className="text-xs text-gray-500">Tel: +1 234 567 890</p>
                    </div>

                    <div className="border-b border-dashed border-gray-400 pb-4 mb-4">
                        <p>Order #: {order._id ? order._id.slice(-6).toUpperCase() : '------'}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                        <p>Cashier: {order.cashierId?.name || 'Unknown'}</p>
                        <p>Pay Method: {order.paymentMethod?.toUpperCase() || 'CASH'}</p>
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
                                {order.items?.map((item, idx) => (
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
                            <span>Service Charges:</span>
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
                </>
            ) : (
                <div className="text-center">No Order Data</div>
            )}

            {/* Print specific styles */}
            <style type="text/css" media="print">
                {`
                    @page { size: auto; margin: 0mm; } 
                    body { background-color: white; }
                    /* Hide everything else when printing if needed, though react-to-print handles this via ref */
                `}
            </style>
        </div>
    );
});

export default Receipt;
