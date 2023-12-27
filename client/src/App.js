import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import ErrorBoundary from "./Error";
import ForgetPassword from "./pages/ForgetPassword";
import Otp from "./pages/Otp";

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
     
      data.user._json.gitemail = data?.user?.emails?.[0]?.value;
      setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ErrorBoundary>
    <div className="container">
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
         <Route
          exact
          path="/forgotpassword"
          element={ <ForgetPassword />}
        />
          <Route
          exact
          path="/otp"
          element={ <Otp />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </div>
    </ErrorBoundary>
  );
}

export default App;
