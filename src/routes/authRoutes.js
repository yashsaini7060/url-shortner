import { Router } from "express";
import passport from "passport";

const router = Router();

// Initiate google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


// Callback after Google has authenticated to user
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);



// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.redirect("/");
  });
});

export default router;