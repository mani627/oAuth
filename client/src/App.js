import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import ErrorBoundary from "./Error";
import ForgetPassword from "./pages/ForgetPassword";
import Otp from "./pages/Otp";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUser = async (data) => {
    try {
      if (data === "logout") {
        setUser(null);
      } else {
        let currentTime = new Date();
        let storedData = JSON.parse(localStorage.getItem("userDetails"));
        if (storedData) {
          if (currentTime > storedData?.expire) {
            setUser(null);
          } else {
            setUser({
              name: storedData?.details[1],
              avatar_url: "https://gravatar.com/avatar/HASH ",
              email: storedData?.details[0],
            });
          }
        } else {
          const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
          const { data } = await axios.get(url, { withCredentials: true });

          data.user._json.gitemail = data?.user?.emails?.[0]?.value;
          setUser(data.user._json);
        }
      }
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
            element={
              user ? (
                <Home user={user} getUser={getUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            exact
            path="/login"
            element={user ? <Navigate to="/" /> : <Login getUser={getUser} />}
          />
          <Route
            exact
            path="/forgotpassword"
            element={user ? <Navigate to="/" /> : <ForgetPassword />}
          />
          <Route
            exact
            path="/otp"
            element={user ? <Navigate to="/" /> : <Otp />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
