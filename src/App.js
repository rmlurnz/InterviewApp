import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages & Components
import Home from "./pages/Home";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import NavigationBar from "./components/NavigationBar";
import "./App.css";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/account"
            element={<Account />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
