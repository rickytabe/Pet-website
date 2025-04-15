import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { format } from 'date-fns';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'N/A';
    return format(timestamp.toDate(), 'MMMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">User Profile</h1>
          <p className="text-blue-100">Manage your account information</p>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
            
            <div className="space-y-2">
              <ProfileField label="Name" value={user?.name || 'Not provided'} />
              <ProfileField label="Email" value={user?.email || 'Not provided'} />
              <ProfileField label="Account Type" value={user?.role === 'admin' ? 'Administrator' : 'Standard User'} />
              <ProfileField label="Member Since" value={formatDate(user?.createdAt)} />
            </div>
          </div>

          {/* Account Activity */}
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
                value={user?.cart?.length || 0} 
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

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable profile field component
const ProfileField = ({ label, value, subtext, isCode = false }: { 
  label: string; 
  value: string | number; 
  subtext?: string; 
  isCode?: boolean 
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="flex items-baseline mt-1">
      {isCode ? (
        <code className="text-xs bg-gray-100 p-1 rounded text-gray-800 break-all">
          {value}
        </code>
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {value}
          {subtext && <span className="ml-1 text-sm text-gray-500">{subtext}</span>}
        </p>
      )}
    </div>
  </div>
);