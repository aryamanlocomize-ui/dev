import { Link } from 'react-router-dom';

const HomePage = () => (
  <section className="bg-white border rounded-2xl p-10 text-center">
    <h1 className="text-4xl font-bold text-gray-900">Food delivery marketplace MVP</h1>
    <p className="text-gray-600 mt-4">Customer, restaurant, delivery and admin workflows in one scalable platform.</p>
    <Link to="/restaurants" className="inline-block mt-6 bg-brand text-white px-6 py-3 rounded-lg">
      Explore restaurants
    </Link>
  </section>
);

export default HomePage;
