function isLoggedIn(req,res,next){
    if(!req.session.loggedUser){
      res.redirect('/register')
    }
    next();
  }

  module.exports.isLoggedIn=isLoggedIn;