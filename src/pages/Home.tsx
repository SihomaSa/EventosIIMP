import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
          <h1>Bienvenido</h1>
          <Link to="/about">Ir a Acerca de</Link>
        </div>
      );
  }