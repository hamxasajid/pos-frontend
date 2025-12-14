import React, { useEffect, useState } from 'react';
// We don't have a slice for fetching all orders in the same way, we can create one or just fetch directly here.
// For robust app, create orderSlice. But for speed now, direct fetch or reuse api.
import api from '../../utils/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import { formatCurrency } from '../../utils/helpers';
import { Calendar, User, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Order #${(order._id || order.id || '??????').slice(-6).toUpperCase()}`}>
            <div className="space-y-4">
                <div className="flex justify-between items-start text-sm text-gray-500 dark:text-gray-400">
                    <div>
                        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                        <p>Cashier: {order.cashierId?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.paymentMethod === 'cash' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30'}`}>
                            {order.paymentMethod}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Items</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-500">Service Charges</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-bold border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-primary-600 dark:text-primary-400">{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (error) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>

            <Table headers={['Order ID', 'Date', 'Cashier', 'Items', 'Total', 'Payment']}>
                {orders.map(order => (
                    <TableRow key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-mono text-xs text-gray-500">
                            #{(order._id || order.id || '??????').slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                {order.cashierId?.name || 'Unknown'}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="max-w-[200px] truncate" title={order.items.map(i => i.name).join(', ')}>
                                {order.items.length} items ({order.items[0]?.name}...)
                            </div>
                        </TableCell>
                        <TableCell className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>
                            <span className={`capitalize px-2 py-1 rounded-md text-xs font-bold ${order.paymentMethod === 'cash'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                }`}>
                                {order.paymentMethod}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <OrderDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
};

export default OrderHistory;
