const router = require("express").Router();
const passport = require("passport");


// success
router.get("/login/success", (req, res) => {
	try{
		if (req.user) {
			res.status(200).json({
				error: false,
				message: "Successfully Loged In",
				user: req.user,
			});
		} else {
			res.status(403).json({ error: true, message: "Not Authorized" });
		}
	}
	catch(er){
		next(new Error(er))
	}
	
});


// failed
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});


// google
router.get("/google", passport.authenticate("google", ["profile", "email"]));
router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);


// fb
router.get('/fb',
  passport.authenticate('facebook'));
  router.get(
	"/fb/callback",
	passport.authenticate('facebook', {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

// git
router.get('/github',
  passport.authenticate('github',{ scope: [ 'user:email' ] }));
  router.get(
	"/github/callback",
	passport.authenticate('github', {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

// logout
router.get("/logout", (req, res) => {
	try{
		req.logout();
		res.redirect(process.env.CLIENT_URL);
	}catch(er){
		next(new Error(er))
	}
	
});

module.exports = router;
