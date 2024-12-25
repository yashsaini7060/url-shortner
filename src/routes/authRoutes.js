import { Router } from "express";
import passport from "passport";

const router = Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Initiates Google OAuth2 authentication flow
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google login
 * 
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the Google OAuth2 callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to dashboard on success
 * 
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the currently authenticated user
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to home page
 */

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