// context/OrdersContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order } from '../types/user';
import { 
  getOrdersByUser, 
  updateOrder, 
  deleteOrder 
} from '../services/orders';
import { useAuth } from './AuthContext';

type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType>({} as OrdersContextType);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await getOrdersByUser(user.uid);
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: 'cancelled' });
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      setError('Failed to delete order. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        refreshOrders: fetchOrders,
        cancelOrder: handleCancelOrder,
        deleteOrder: handleDeleteOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);