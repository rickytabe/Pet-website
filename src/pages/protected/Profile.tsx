// pages/protected/Profile.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useOrders } from '../../context/OrderContext';
import { Button } from '../../components/common/Button';
import { Order } from '../../types/user';
import { Loader } from '../../components/common/Loader';

const Profile = () => {
  const { user, logout } = useAuth();
  const { orders, loading, error, cancelOrder, refreshOrders } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  

  const filteredOrders = (orders || []).filter(order =>
    activeTab === 'all' ? true : order.status === activeTab
   )

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);
  const formatDate = (date: Date) => format(date, 'PPpp');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">User Profile</h1>
          <p className="text-blue-100">Manage your account information</p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Existing Profile Sections */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
            <div className="space-y-2">
              <ProfileField label="Name" value={user?.name || 'Not provided'} />
              <ProfileField label="Email" value={user?.email || 'Not provided'} />
              <ProfileField label="Account Type" value={user?.role === 'admin' ? 'Administrator' : 'Standard User'} />
              <ProfileField label="Member Since" value={user?.createdAt ? formatDate(user.createdAt.toDate()) : 'N/A'} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Account Activity</h2>
            <div className="space-y-2">
              <ProfileField 
                label="Documents Purchased" 
                value={user?.purchasedDocs?.length || 0} 
                subtext="items"
              />
              <ProfileField 
                label="Items in Cart" 
                value={user?.cart.length || 0} 
                subtext="items"
              />
              <ProfileField 
                label="User ID" 
                value={user?.uid || 'Not available'} 
                isCode
              />
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="p-6 md:p-8 border-t">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Order History</h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'completed', 'cancelled'].map(tab => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab(tab as any)}
                  className="capitalize text-sm"
                >
                  {tab} ({(orders || []).filter(o => tab === 'all' ? true : o.status === tab).length})
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading orders...</p>
                <div className="mt-4">
                  <Loader size="lg" />
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">{error}</p>
                <Button variant="secondary" onClick={refreshOrders} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No {activeTab} orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id}
                    order={order}
                    onCancel={cancelOrder}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <button className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2' onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onCancel, formatDate }: { 
  order: Order;
  onCancel: (id: string) => Promise<void>;
  formatDate: (date: Date) => string;
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancel(order.id);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">Order #{order.id.slice(0,8).toUpperCase()}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <p className="font-medium">Total Amount</p>
          <p>${order.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-medium">Payment Method</p>
          <p className="capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="font-medium">Shipping Address</p>
          <p>{order.shippingAddress}</p>
        </div>
      </div>

      {order.status === 'pending' && (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="secondary" 
            onClick={handleCancel}
            loading={isCancelling}
            className="text-sm"
          >
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ label, value, subtext, isCode = false }: { 
  label: string; 
  value: string | number; 
  subtext?: string; 
  isCode?: boolean 
}) => (
  <div className="py-2">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1">
      {isCode ? (
        <code className="text-xs bg-gray-100 p-1 rounded text-gray-800 break-all">
          {value}
        </code>
      ) : (
        <p className="text-base text-gray-800">
          {value}
          {subtext && <span className="ml-1 text-sm text-gray-500">{subtext}</span>}
        </p>
      )}
    </dd>
  </div>
);

export default Profile;