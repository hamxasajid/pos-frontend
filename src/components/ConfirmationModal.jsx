import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                    <AlertTriangle size={32} />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{message}</p>
                </div>

                <div className="flex gap-3 w-full pt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
