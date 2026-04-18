import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-6xl mx-auto p-4">{children}</main>
  </div>
);

export default MainLayout;
