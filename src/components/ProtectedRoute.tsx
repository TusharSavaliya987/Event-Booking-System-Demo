import { Navigate, Outlet } from 'react-router-dom';
import { getUserSession } from '../utils/auth';

const ProtectedRoute = () => {
  const user = getUserSession();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
