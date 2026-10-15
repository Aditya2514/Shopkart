import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart");
      setCartItems(res.data.cart || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "adding" }));
    setError("");
    try {
      const res = await api.post(`/cart/${productId}`);
      setCartItems(res.data.cart || []);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "updating" }));
    setError("");
    try {
      const res = await api.patch(`/cart/${productId}`, { quantity });
      setCartItems(res.data.cart || []);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update quantity";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const removeFromCart = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "removing" }));
    setError("");
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCartItems(res.data.cart || []);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove from cart";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find((ci) => {
      const id = typeof ci.product === "object" ? ci.product?._id : ci.product;
      return id === productId;
    });
    return item ? item.quantity : 0;
  };

  const isItemLoading = (productId) => actionLoading[productId] || false;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        totalCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getItemQuantity,
        isItemLoading,
        actionLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
