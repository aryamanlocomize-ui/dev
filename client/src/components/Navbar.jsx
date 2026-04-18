import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-brand font-bold text-xl">
          Zomato MVP
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/cart">Cart ({items.length})</Link>
          {user && <Link to="/orders">Orders</Link>}
          {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
          {user ? (
            <>
              <Link to="/profile">{user.name}</Link>
              <button type="button" onClick={logout} className="px-3 py-1 bg-gray-100 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="px-3 py-1 bg-brand text-white rounded" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
