export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0
    }).format(amount).replace('PKR', 'Rs');
};

export const calculateTotal = (cartItems, discount = 0, includeTax = true) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = includeTax ? subtotal * 0.1 : 0; // 10% tax if enabled
    const total = subtotal + tax - discount;
    return { subtotal, tax, total };
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

    // Remove leading slash if present to avoid double slash issues or just handling it logic
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    // Base URL from env or default
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');

    return `${baseUrl}${path}`;
};
