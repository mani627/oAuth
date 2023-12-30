import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import { Axios } from "../../service/axios";

function Register() {
  const navigate = useNavigate();
  const [clickLimitation, seClickLimitation] = useState({
    count: 0,
    minutes: 1,
    seconds: 10,
  });

  const [inputDatas, setInputDatas] = useState({
    username: "",
    email: "",
    password: "",
    isVisible: true,
    isVisibleCnfrm: true,
  });

  const showPass = (type = null) => {
    console.log(type);
    setInputDatas((prev) => ({
      ...prev,
      isVisible: type === null ? !prev.isVisible : prev.isVisible,
      isVisibleCnfrm:
        type !== null ? !prev.isVisibleCnfrm : prev.isVisibleCnfrm,
    }));
  };

  const countDown = () => {
    console.log("calling");
    let timer = setInterval(() => {
      seClickLimitation((prev) => {
        if (prev.seconds === 0 && prev.minutes === 0) {
          clearInterval(timer);
        }
        return {
          ...prev,
          count: prev.seconds === 0 && prev.minutes === 0 ? 0 : prev.count,
          seconds:
            prev.seconds === 0 && prev.minutes === 0
              ? 59
              : prev.seconds === 0
              ? 59
              : prev.seconds - 1,
          minutes:
            prev.seconds === 0 && prev.minutes === 0
              ? 1
              : prev.seconds === 0
              ? 0
              : prev.minutes,
        };
      });
    }, 1000);
  };

  const register = async () => {
    seClickLimitation((prev) => {
      if (prev.count === 3) {
        countDown();
      }
      return {
        ...prev,
        count: prev.count + 1,
      };
    });
    console.log(document.getElementById("cnfrm_pass").value);
    if (inputDatas.password === document.getElementById("cnfrm_pass").value) {
      let result = await Axios(
        "/userAuth/signup",
        {
          email: inputDatas.email,
          password: inputDatas.password,
          username: inputDatas.username,
        },
        null,
        null
      );
      if (result?.data?.message === "User Created") {
        alert("created!!!");
        navigate("/login");
      } else if (result?.response?.data.error) {
        alert(result?.response?.data.message);
      }
      console.log(result);
    } else {
      alert("Passwords Must Be same");
    }
  };

  const onInputChange = (e) => {
    setInputDatas((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Register</h2>

          <input
            type="text"
            onChange={onInputChange}
            className={styles.input}
            name="username"
            placeholder="UserName"
          />
          <input
            type="text"
            onChange={onInputChange}
            className={styles.input}
            name="email"
            placeholder="Email"
          />
          <div style={{ position: "relative" }}>
            <input
              type={!inputDatas.isVisible ? "text" : "password"}
              className={styles.input}
              placeholder="Password"
              name="password"
              onChange={onInputChange}
            />
            <img
              onClick={() => showPass()}
              src={`./images/${
                inputDatas.isVisible ? "closed-eye" : "eye"
              }.png`}
              style={{
                height: "25px",
                width: "25px",
                cursor: "pointer",
                position: "absolute",
                right: "6px",
                top: "25%",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="cnfrm_pass"
              type={!inputDatas.isVisibleCnfrm ? "text" : "password"}
              className={styles.input}
              placeholder="Confirm Password"
            />
            <img
              onClick={() => showPass("cnfrm")}
              src={`./images/${
                inputDatas.isVisibleCnfrm ? "closed-eye" : "eye"
              }.png`}
              style={{
                height: "25px",
                width: "25px",
                cursor: "pointer",
                position: "absolute",
                right: "6px",
                top: "25%",
              }}
            />
          </div>

          <button
            className={styles.btn}
            disabled={clickLimitation.count === 4 ? true : false}
            style={{ cursor: clickLimitation.count === 4 ? "wait" : "pointer" }}
            onClick={register}
          >
            Register
          </button>

          <br />
          {clickLimitation.count === 4 ? (
            <span>
              0{clickLimitation.minutes} :{" "}
              {clickLimitation.seconds <= 9 ? "0" : null}
              {clickLimitation.seconds}
            </span>
          ) : null}
          <br />
          <Link to="/forgotpassword">Forget Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
