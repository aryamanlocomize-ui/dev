import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.menuItemId === menuItem._id);
      if (existing) {
        return prev.map((x) =>
          x.menuItemId === menuItem._id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          restaurant: menuItem.restaurant
        }
      ];
    });
  };

  const updateQty = (id, quantity) => {
    setItems((prev) => prev.map((x) => (x.menuItemId === id ? { ...x, quantity: Math.max(1, quantity) } : x)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.menuItemId !== id));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clearCart, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
