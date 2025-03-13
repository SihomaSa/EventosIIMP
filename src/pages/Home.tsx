import { useAuth } from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, {user}!</h1>
      <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
    </div>
  );
}
