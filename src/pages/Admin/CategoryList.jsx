import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, addCategory, deleteCategory } from '../../redux/categorySlice';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Table, { TableRow, TableCell } from '../../components/Table';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Trash2, Plus, Tag } from 'lucide-react';

const CategoryList = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategory) {
            dispatch(addCategory(newCategory));
            setNewCategory('');
            setIsModalOpen(false);
        }
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteCategory(deleteId));
            setDeleteId(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add Category
                </Button>
            </div>

            <div className="w-full max-w-2xl">
                <Table headers={['Category Name', 'Actions']}>
                    {categories.map((cat, idx) => (
                        <TableRow key={cat.id || idx}>
                            <TableCell className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <Tag size={16} className="text-primary-500" />
                                {cat.name || cat}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" className="!p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleteId(cat.id || cat.name || cat)}>
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., Snacks"
                        required
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Add Category</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete category "${deleteId}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default CategoryList;
