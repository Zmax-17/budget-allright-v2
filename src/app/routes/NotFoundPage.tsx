import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <button
        onClick={handleReturn}
        className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition"
      >
        {user ? "Return to dashboard " : "Return to login"}
      </button>
    </div>
  );
}
