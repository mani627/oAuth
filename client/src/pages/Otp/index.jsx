import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { Axios } from "../../service/axios";
import { useLocation } from "react-router-dom";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { otp, email } = location?.state;

  const [clickLimitation, seClickLimitation] = useState({
    count: 0,
    minutes: 1,
    seconds: 10,
  });
  const [inputDatas, setInputDatas] = useState({
    isVisible: true,
  });
  const inputRef = useRef();
  const passRef = useRef();

  const showPass = () => {
    setInputDatas((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
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
  console.log(
    clickLimitation.seconds,
    clickLimitation.minutes,
    clickLimitation.count
  );
  const logIn = async () => {
    seClickLimitation((prev) => {
      if (prev.count === 3) {
        countDown();
      }
      return {
        ...prev,
        count: prev.count + 1,
      };
    });

    if (otp === Number(inputRef.current.value)) {
      let result = await Axios(
        "/userAuth/changepassword",
        { password: passRef.current.value, email: email },
        null,
        null
      );
      console.log(result);
      if (result.response.data.error) {
        alert(result.response.data.message);
      } else if (result.message === "Changed Successfully") {
        alert("Changed Successfully");
        navigate("/login");
      }
    } else {
      alert("OTP Mismatch");
    }
  };
  
  if (!otp) {
    navigate("/forgotpassword");
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Enter OTP</h2>

          <input
            ref={inputRef}
            type="text"
            name="email"
            className={styles.input}
            placeholder="Enter OTP"
          />
          <div style={{ position: "relative" }}>
            <input
              ref={passRef}
              type={!inputDatas.isVisible ? "text" : "password"}
              className={styles.input}
              placeholder="Password"
            />
            <img
              onClick={showPass}
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

          <button
            className={styles.btn}
            disabled={clickLimitation.count === 4 ? true : false}
            style={{ cursor: clickLimitation.count === 4 ? "wait" : "pointer" }}
            onClick={logIn}
          >
            Submit
          </button>

          <br />
          {clickLimitation.count === 4 ? (
            <span>
              0{clickLimitation.minutes} :{" "}
              {clickLimitation.seconds <= 9 ? "0" : null}
              {clickLimitation.seconds}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Otp;
