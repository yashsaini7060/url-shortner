//Middleware to check if user is authenticated 
//If not authenticated, redirects to login page
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};


//Middleware to check if user is NOT authenticated

export const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};
