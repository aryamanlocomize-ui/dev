import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../api/http';
import { useCart } from '../context/CartContext';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await http.get(`/restaurants/${id}`);
      setRestaurant(data);
    };
    fetchDetail();
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <section className="space-y-6">
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-2xl font-bold">{restaurant.name}</h2>
        <p className="text-gray-600 mt-2">{restaurant.description}</p>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">Menu</h3>
        <div className="space-y-3">
          {restaurant.menu?.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <button
                type="button"
                onClick={() => addItem(item)}
                disabled={items.length > 0 && items[0].restaurant !== item.restaurant}
                className="px-3 py-1 bg-brand text-white rounded disabled:opacity-50"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantDetailPage;
