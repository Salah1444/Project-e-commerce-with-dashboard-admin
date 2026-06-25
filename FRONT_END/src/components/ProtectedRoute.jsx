import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { SetLoginForm } from '../store/userSlice';
import Loading from './Loading';

const ProtectedRoute = ({ adminOnly = false }) => {
  const dispatch = useDispatch();
  const { isAuth, user, loading, token } = useSelector((state) => state.user);

  // Still loading auth state — don't redirect yet
  if (loading) {
    return (
      <Loading/>
    );
  }

  // Not authenticated at all
  if (!isAuth && !token) {
    dispatch(SetLoginForm()); // open login modal
    return <Navigate to="/" replace />;
  }

  // We have a token, but user info is still loading from the server
  if (token && user === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Authenticated but not an admin, trying to access admin route
  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/forbidden" replace />;
  }

  // All checks passed
  return <Outlet />;
};

export default ProtectedRoute;