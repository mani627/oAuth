import styles from "./styles.module.css";

function Home(userDetails) {
  const user = userDetails.user;

  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };
  let image_src = user.avatar_url
    ? user.avatar_url
    : !user.picture.data
    ? user.picture
    : user.picture.data.url;
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Home</h1>
      <div className={styles.form_container}>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Profile</h2>
          <img src={image_src} alt="profile" className={styles.profile_img} />
          <input
            type="text"
            defaultValue={user.login ? user.login : user.name}
            className={styles.input}
            placeholder="UserName"
            disabled
          />
          <input
            type="text"
            defaultValue={user.gitemail ?? user.email}
            className={styles.input}
            placeholder="Email"
            disabled
          />
          <button className={styles.btn} onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
