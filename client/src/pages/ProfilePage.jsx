import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <p>Please login to view profile.</p>;

  return (
    <section className="bg-white border rounded-xl p-5 max-w-lg">
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="mt-2"><span className="font-medium">Name:</span> {user.name}</p>
      <p><span className="font-medium">Email:</span> {user.email}</p>
      <p><span className="font-medium">Role:</span> {user.role}</p>
    </section>
  );
};

export default ProfilePage;
