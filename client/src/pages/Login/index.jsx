import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";

function Login() {
  const [clickLimitation, seClickLimitation] = useState({
    count: 0,
    minutes: 1,
    seconds: 10,
  });

  const [inputDatas, setInputDatas] = useState({
    email: "",
    password: "",
    isVisible: true,
  });
  const googleAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  };

  const fbAuth = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/fb/callback`, "_self");
  };

  const githubAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/github/callback`,
      "_self"
    );
  };

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
        if(prev.seconds === 0 && prev.minutes === 0){
          clearInterval(timer)
        }
        return {
          ...prev,
          count:prev.seconds === 0 && prev.minutes === 0?0:prev.count,
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

  const logIn = () => {
   
      seClickLimitation((prev) =>{
        if(prev.count===3){
          countDown ()
        }
        return({
          ...prev,
          count: prev.count + 1,
        })
       
      });
    
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}> Log in</h2>

          <input type="text" className={styles.input} placeholder="Email" />
          <div style={{ position: "relative" }}>
            <input
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

          <button className={styles.btn} disabled={clickLimitation.count===4?true:false} style={{cursor:clickLimitation.count===4?"wait":"pointer"}} onClick={logIn}>
            Log In
          </button>
          <p className={styles.text}>or</p>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className={styles.google_btn} onClick={googleAuth}>
              <img src="./images/google.png" alt="google icon" />
              <span>Sing in with Google</span>
            </button>

            {/* <button className={styles.google_btn} onClick={fbAuth}>
              <span>Sing in with FB</span>
            </button> */}

            <span style={{ flex: 0.1 }}></span>
            <button className={styles.google_btn} onClick={githubAuth}>
              <img src="./images/git.png" alt="google icon" />
              <span>Sing in with GitHub</span>
            </button>
          </div>
          <br/>
          {clickLimitation.count===4?<span>0{clickLimitation.minutes} : {clickLimitation.seconds<=9?"0":null}{clickLimitation.seconds}</span>:null}
          <br/>
          <Link to="/forgotpassword">Forget Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
