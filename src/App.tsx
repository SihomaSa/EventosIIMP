import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Contexts/authContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import ProtectedRoute from "./utils/ProtectedRoute";
import { EventProvider } from "./stores/eventStore";
import Sponsors from "./pages/Sponsors";
import HomeLayout from "./components/HomeLayout";
import Ads from "./pages/Ads";
import Bulletins from "./pages/Bulletins";
import PressNotes from "./pages/PressNotes";
import Expositors from "./pages/Expositors";
import { ThemeProvider } from "./Contexts/themeContext";

function App() {
	return (
		<>
			<ThemeProvider>
				<AuthProvider>
					<EventProvider>
						<Router>
							<Routes>
								<Route path="/" element={<Login />} />
								<Route element={<ProtectedRoute />}>
									<Route path="/events" element={<Events />} />
									<Route path="/home" element={<HomeLayout />}>
										<Route path="sponsors" element={<Sponsors />} />
										<Route path="bulletins" element={<Bulletins />} />
										<Route path="press" element={<PressNotes />} />
										<Route path="ads" element={<Ads />} />
										<Route path="expositors" element={<Expositors />} />
									</Route>
									<Route path="/home" element={<Home children={undefined} />} />
								</Route>
								<Route path="/about" element={<About />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</Router>
					</EventProvider>
				</AuthProvider>
			</ThemeProvider>
		</>
	);
}

export default App;
