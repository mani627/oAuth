import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Login() {
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
  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}> Log in</h2>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sing in with Google</span>
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={fbAuth}>
            <span>Sing in with FB</span>
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={githubAuth}>
            <span>Sing in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
