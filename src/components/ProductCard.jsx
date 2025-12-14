import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import Button from './Button';
import { Plus } from 'lucide-react';
import { getImageUrl, formatCurrency } from '../utils/helpers';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    // Calculate Final Price
    let finalPrice = product.price; // Default to base price (or sellingPrice)
    // The user data shows price and sellingPrice as 550. Let's assume 'price' is the reference.
    // If sellingPrice is meant to be the override, we'd use that.
    // Given the prompt implies discount is applied ON TOP of basic info:
    if (product.discountType === 'flat' && product.discountValue > 0) {
        finalPrice = product.price - product.discountValue;
    } else if (product.discountType === 'percentage' && product.discountValue > 0) {
        finalPrice = product.price - (product.price * (product.discountValue / 100));
    }

    // Determine Low Stock Threshold (default to 5 if not set)
    const lowStockThreshold = product.lowStockAlert || 5;
    const isLowStock = product.stock <= lowStockThreshold;
    const isAvailable = product.isActive !== false; // Default to true if undefined, honoring specific false

    return (
        <div
            className={`bg-white dark:bg-gray-900 m-2 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 relative overflow-hidden h-full flex flex-col
            ${isAvailable ? 'hover:shadow-lg hover:border-primary-500/30 dark:hover:border-primary-500/30 group cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}
            onClick={() => isAvailable && dispatch(addToCart({ ...product, price: finalPrice }))}
        >
            {/* Not Available Overlay */}
            {!isAvailable && (
                <div className="absolute inset-0 z-20 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg transform -rotate-12 border border-white/20">
                        Not Available
                    </span>
                </div>
            )}

            {/* Discount Badge */}
            {isAvailable && product.discountType !== 'none' && product.discountValue > 0 && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl z-[1] shadow-md">
                    {product.discountType === 'flat' ? `Rs ${product.discountValue} OFF` : `${product.discountValue}% OFF`}
                </div>
            )}

            <div className="h-40 w-full mb-4 rounded-xl overflow-hidden relative shrink-0">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? 'group-hover:scale-110' : 'grayscale'}`}
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                    {finalPrice < product.price ? (
                        <div className="flex flex-col items-end leading-tight">
                            <span className="text-red-500 line-through text-[10px]">{formatCurrency(product.price)}</span>
                            <span>{formatCurrency(finalPrice)}</span>
                        </div>
                    ) : (
                        formatCurrency(product.price)
                    )}
                </div>
            </div>

            <div className="mb-2 flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5em]" title={product.description}>
                    {product.description || 'No description available.'}
                </p>
            </div>

            <div className="flex justify-between items-center text-sm mb-3 mt-auto">
                <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{product.category}</span>
                <span className={`text-xs font-bold ${isLowStock ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                    {isLowStock ? `Low Stock: ${product.stock}` : `Stock: ${product.stock}`}
                </span>
            </div>

            <Button
                variant="primary"
                className={`w-full transform transition-all duration-300 ${isAvailable ? 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0' : 'opacity-0 hidden'}`}
                disabled={!isAvailable}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isAvailable) {
                        dispatch(addToCart({ ...product, price: finalPrice }));
                    }
                }}
            >
                <Plus size={16} /> Add
            </Button>
        </div>
    );
};

export default ProductCard;
