import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import Button from './Button';
import { Plus } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    return (
        <div className="bg-white dark:bg-gray-900 m-2 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 group cursor-pointer" onClick={() => dispatch(addToCart(product))}>
            <div className="h-40 w-full mb-4 rounded-xl overflow-hidden relative">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">{product.name}</h3>
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                <span>{product.category}</span>
                <span>Stock: {product.stock}</span>
            </div>
            <Button
                variant="primary"
                className="w-full mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart(product));
                }}
            >
                <Plus size={16} /> Add
            </Button>
        </div>
    );
};

export default ProductCard;
