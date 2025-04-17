// services/orders.ts
import { db } from "../config/firebase";
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { Order } from "../types/user";

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp()
    });

    const orderSnapshot = await getDoc(doc(db, "orders", orderRef.id));
    const createdOrder = {
      id: orderRef.id,
      ...orderSnapshot.data(),
      createdAt: orderSnapshot.data()?.createdAt
    } as Order;

    return createdOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Order[];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  return updateOrder(orderId, { status: 'cancelled' });
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);
    
    if (orderSnapshot.exists()) {
      return {
        id: orderSnapshot.id,
        ...orderSnapshot.data(),
        createdAt: orderSnapshot.data().createdAt?.toDate()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
};