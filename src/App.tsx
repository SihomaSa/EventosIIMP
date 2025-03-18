import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Contexts/authContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import ProtectedRoute from "./utils/ProtectedRoute";
import EventNew from "./pages/EventNew";
import { EventProvider } from "./stores/eventStore";
import Sponsors from "./pages/Sponsors";
import HomeLayout from "./components/HomeLayout";
import Ads from "./pages/Ads";
import Bulletins from "./pages/Bulletins";
import PressNotes from "./pages/PressNotes";
import Expositors from "./pages/Expositors";
import ExpositorDetail from "./pages/ExpositorDetail";
import PressNoteDetail from "./pages/PressNoteDetail";
import BulletinDetail from "./pages/BulletinDetail";

function App() {
	return (
		<>
			<AuthProvider>
				<EventProvider>
					<Router>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/events" element={<Events />} />
								<Route path="/home" element={<HomeLayout />}>
									<Route path="sponsors" element={<Sponsors />} />
									<Route path="bulletins" element={<Bulletins />} />
									<Route path="press" element={<PressNotes />} />
									<Route path="ads" element={<Ads />} />
									<Route path="expositors" element={<Expositors />} />
								</Route>
								<Route path="/bulletins/:id" element={<BulletinDetail />} />
								<Route path="/pressnotes/:id" element={<PressNoteDetail />} />
								<Route path="/expositors/:id" element={<ExpositorDetail />} />
								<Route path="/newEvent" element={<EventNew />} />
								<Route path="/home" element={<Home />} />
							</Route>
							<Route path="/about" element={<About />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Router>
				</EventProvider>
			</AuthProvider>
		</>
	);
}

export default App;
