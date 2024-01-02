import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);
 

  const getUser = async (data) => {
    try {
      if (data === "logout") {
        setUser(null);
      } else {
        let currentTime = new Date();
        let storedData = JSON.parse(localStorage.getItem("userDetails"));
        if (storedData) {
          if (currentTime > storedData?.expireDate) {
            localStorage.clear();
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
          element={user ? <Navigate to="/home" /> : <Login getUser={getUser} />}
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
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/home"
          element={
            user ? (
              <Home user={user} getUser={getUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}

export default App;
