import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { Axios } from "../../service/axios";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const navigate = useNavigate();
  const [clickLimitation, seClickLimitation] = useState({
    count: 0,
    minutes: 1,
    seconds: 10,
  });
  const inputRef = useRef();

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
    document.getElementById("button_disable").disabled = true;
    seClickLimitation((prev) => {
      if (prev.count === 3) {
        countDown();
      }
      return {
        ...prev,
        count: prev.count + 1,
      };
    });

    let result = await Axios(
      "/userAuth/forgotPassword",
      { email: inputRef.current.value },
      null,
      null
    );
    document.getElementById("button_disable").disabled = false;
    if (result?.response?.data.error) {
      alert(result.response.data.message);
    } else {
      navigate("/otp",{state:{ otp: result?.data?.message,email:inputRef.current.value }} );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Forget Password</h2>

          <input
            ref={inputRef}
            type="text"
            name="email"
            className={styles.input}
            placeholder="Email"
          />

          <button
            id="button_disable"
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

export default ForgetPassword;
