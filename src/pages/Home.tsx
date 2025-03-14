import HomeLayout from "../components/HomeLayout";
// import { useAuth } from "../Contexts/authContext";
// import { useNavigate } from "react-router-dom";

export default function Home() {
  // const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>

  return (
    <HomeLayout>
      {/* <Event label="proExplo intro" /> */}
      <h2 className="text-2xl font-bold">Bienvenido</h2>
    </HomeLayout>
  );
}
