import { useEffect, useState } from 'react';
import http from '../api/http';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ search: '', cuisine: '' });

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data } = await http.get('/restaurants', { params: filters });
      setRestaurants(data);
    };
    fetchRestaurants();
  }, [filters]);

  return (
    <section>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search restaurant"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Cuisine"
          value={filters.cuisine}
          onChange={(e) => setFilters((f) => ({ ...f, cuisine: e.target.value }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
};

export default RestaurantsPage;
