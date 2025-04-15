import { Link, Outlet } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext'; // Updated import

export const AdminDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-xl">Unauthorized Access</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/admin/dogs">
              <Button variant="secondary">Manage Dogs</Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="secondary">Manage Orders</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};