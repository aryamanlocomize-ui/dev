import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';

const roleActions = {
  restaurant: ['accepted', 'preparing', 'rejected'],
  delivery: ['picked', 'on_the_way', 'delivered']
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    const { data } = await http.get('/orders/my');
    setOrders(data);
  }, []);

  useSocket(
    useCallback(
      (incoming) => {
        setOrders((prev) => {
          const exists = prev.some((x) => x._id === incoming._id);
          if (exists) return prev.map((x) => (x._id === incoming._id ? incoming : x));
          return [incoming, ...prev];
        });
      },
      [setOrders]
    )
  );

  useEffect(() => {
    if (user) fetchOrders();
  }, [fetchOrders, user]);

  const handleStatus = async (orderId, status) => {
    await http.patch(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between">
              <p className="font-medium">Order #{order._id.slice(-6)}</p>
              <p className="capitalize text-sm">{order.status.replaceAll('_', ' ')}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total: ₹{order.totalAmount}</p>
            <ul className="text-sm mt-2 list-disc pl-5">
              {order.items.map((item) => (
                <li key={item.menuItem}>{item.name} x {item.quantity}</li>
              ))}
            </ul>

            {roleActions[user?.role] && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {roleActions[user.role].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatus(order._id, status)}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    {status.replaceAll('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
