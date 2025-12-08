import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/userSlice';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Table, { TableRow, TableCell } from '../../components/Table';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Edit2, Trash2, Plus, UserPlus } from 'lucide-react';

const UserList = () => {
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.users);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'cashier', isActive: true
    });

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ ...user });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'cashier', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            dispatch(updateUser({ ...formData, id: editingUser.id }));
        } else {
            dispatch(addUser(formData));
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteUser(deleteId));
            setDeleteId(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <Button onClick={() => handleOpenModal()}>
                    <UserPlus size={20} /> Add User
                </Button>
            </div>

            <Table headers={['Name', 'Email', 'Role', 'Actions']}>
                {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-white">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.role}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="!p-2 text-blue-500 hover:bg-blue-50" onClick={() => handleOpenModal(user)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" className="!p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleteId(user.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        disabled={!!editingUser}
                        placeholder={editingUser ? '••••••' : ''}
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="cashier">Cashier</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Active User</span>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editingUser ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};

export default UserList;
