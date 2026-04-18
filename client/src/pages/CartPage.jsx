import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../api/http';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, updateQty, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setError('');
    if (!user) {
      setError('Please login first');
      return;
    }
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      await http.post('/orders', {
        cartItems: items,
        paymentMethod: 'online',
        deliveryAddress: { address: 'Default address' }
      });
      clearCart();
      navigate('/orders');
    } catch (e) {
      setError(e.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4">Your cart</h2>
      {items.length === 0 && <p className="text-gray-600">No items added yet.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-16 border rounded px-2 py-1"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQty(item.menuItemId, Number(e.target.value))}
              />
              <button type="button" className="text-red-600" onClick={() => removeItem(item.menuItemId)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="font-semibold">Subtotal: ₹{total}</p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          type="button"
          onClick={placeOrder}
          disabled={loading}
          className="mt-4 bg-brand text-white px-4 py-2 rounded"
        >
          {loading ? 'Placing...' : 'Place order'}
        </button>
      </div>
    </section>
  );
};

export default CartPage;
