import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => (
  <Link to={`/restaurants/${restaurant._id}`} className="bg-white rounded-xl border p-4 hover:shadow">
    <div className="flex justify-between gap-2">
      <h3 className="font-semibold">{restaurant.name}</h3>
      <span className="text-green-700 text-sm">⭐ {restaurant.rating || 'NA'}</span>
    </div>
    <p className="text-sm text-gray-600 mt-1">{restaurant.cuisines?.join(', ')}</p>
    <p className="text-sm text-gray-500 mt-2">₹{restaurant.priceForTwo} for two</p>
    {restaurant.distanceKm != null && (
      <p className="text-xs text-gray-500 mt-1">{restaurant.distanceKm.toFixed(1)} km away</p>
    )}
  </Link>
);

export default RestaurantCard;
