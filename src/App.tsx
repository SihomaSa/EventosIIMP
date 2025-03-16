import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Contexts/authContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetail from "./components/events/EventDetailModal";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
	return (
		<>
			<AuthProvider>
				<Router>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/home" element={<Home />} />
							<Route path="/events" element={<Events />} />
							<Route path="/events/:id" element={<EventDetail />} />
						</Route>
							<Route path="/about" element={<About />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Router>
			</AuthProvider>
		</>
	);
}

export default App;
