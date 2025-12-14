import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../redux/productSlice';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Table, { TableRow, TableCell } from '../../components/Table';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { fetchCategories } from '../../redux/categorySlice';
import { formatCurrency, getImageUrl } from '../../utils/helpers';

const ProductList = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector(state => state.products);
    const { categories } = useSelector(state => state.categories); // Get categories
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: '',
        image: '',
        sellingPrice: '',
        costPrice: '',
        discountType: 'none',
        discountValue: '0',
        description: '',
        lowStockAlert: '5',
        isActive: true
    });

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                stock: '',
                sellingPrice: '',
                costPrice: '',
                discountType: 'none',
                discountValue: '0',
                description: '',
                lowStockAlert: '5',
                isActive: true,
                image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150&auto=format&fit=crop'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            stock: parseInt(formData.stock),
            sellingPrice: parseFloat(formData.sellingPrice),
            costPrice: parseFloat(formData.costPrice || 0),
            discountValue: parseFloat(formData.discountValue || 0),
            price: parseFloat(formData.sellingPrice), // Sync for backward compatibility
            lowStockAlert: parseInt(formData.lowStockAlert || 5),
        };

        if (editingProduct) {
            dispatch(updateProduct({ ...productData, id: editingProduct.id }));
        } else {
            dispatch(addProduct(productData));
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteProduct(deleteId));
            setDeleteId(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={20} /> Add Product
                    </Button>
                </div>
            </div>

            <Table headers={['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
                {filteredItems.map(item => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-white flex items-center gap-3">
                            <img src={getImageUrl(item.image)} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                            {item.name}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{formatCurrency(item.sellingPrice || item.price)}</span>
                                <span className="text-xs text-gray-400">Cost: {formatCurrency(item.costPrice || 0)}</span>
                            </div>
                        </TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.stock > 10 ? 'In Stock' : 'Low Stock'}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="!p-2 text-primary-500 hover:bg-primary-50" onClick={() => handleOpenModal(item)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" className="!p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleteId(item.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Selling Price" type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} required />
                        <Input label="Cost Price" type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                            >
                                <option value="none">None</option>
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount ($)</option>
                            </select>
                        </div>
                        <Input label="Discount Value" type="number" step="0.01" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} disabled={formData.discountType === 'none'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Low Stock Alert" type="number" value={formData.lowStockAlert} onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })} />
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Active Product</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all min-h-[80px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editingProduct ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};

export default ProductList;
