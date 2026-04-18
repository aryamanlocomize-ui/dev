import { useEffect, useState } from 'react';
import http from '../api/http';

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await http.get('/admin/analytics');
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border rounded p-4">Orders: {analytics.totalOrders}</div>
        <div className="bg-white border rounded p-4">Revenue: ₹{analytics.totalRevenue}</div>
        <div className="bg-white border rounded p-4">Users: {analytics.totalUsers}</div>
        <div className="bg-white border rounded p-4">Restaurants: {analytics.totalRestaurants}</div>
      </div>
    </section>
  );
};

export default AdminPage;
