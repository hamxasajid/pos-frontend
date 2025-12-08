import React from 'react';

const Table = ({ headers, children }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx} className="px-6 py-4">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export const TableRow = ({ children, className = '' }) => (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${className}`}>
        {children}
    </tr>
)

export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 ${className}`}>
        {children}
    </td>
)

export default Table;
