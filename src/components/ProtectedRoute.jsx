import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ roles = [] }) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Or redirect to their home
    }

    return <Outlet />;
};

export default PrivateRoute;
