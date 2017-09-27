var router = require('express').Router();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var passport = require('passport');
var tiwtterStrategy = require('passport-twitter').Strategy;
var facebookStrategy= require('passport-facebook').Strategy;
var User=require('../model/user');
var jwt = require('jsonwebtoken'); 
var config = require('../config/database'); 
var configAuth = require('../config/socialAuth');
var LinkedInStrategy=require('passport-linkedin-oauth2').Strategy;
var nodemailer = require('nodemailer');


passport.use(new LinkedInStrategy({
	clientID        : configAuth.linkedInAuth.clientID,
    clientSecret    : configAuth.linkedInAuth.clientSecret,
    callbackURL     : configAuth.linkedInAuth.callbackURL,
	  scope: ['r_emailaddress', 'r_basicprofile'],
	  state: true
	}, function(accessToken, refreshToken, profile, callback) {
		  process.nextTick(function() {
	          User.findOne({ 'local.email':profile.emails[0].value }, function(err, user) {
	              if (err)
	                  return callback(err);
	              if (user) {
	                  return callback(null, user);
	              } else{
	            	  console.log(profile);
	                  var user = new User();
	                  user.local.id= profile.id;
	                  user.local.username = profile.displayName;
	                  user.local.email = profile.emails[0].value; 
	                  user.local.provider=profile.provider;
	                  var password= Math.floor((1 + Math.random()) * 0x10000).toString(4).substring(1);
	                  
	                  var transporter = nodemailer.createTransport({
	                 service: 'gmail',
	                 auth: {
	                   user: 'sampletask04@gmail.com',
	                   pass: 'sampletask004'
	                 }
	               });

	               var mailOptions = {
	                 from: 'sampletask04@gmail.com',
	                 to: profile.emails[0].value,
	                 subject: 'Sending User Credential',
	                 html:
	                     "<header align='center'>" 
	                    +
	                      "</header> " +
	                      "<div align='center'> Hello  <strong>"+ profile.displayName + "</strong>,<br><br> Your local SignIn password : "+password+" you can reset it by login or by forgot password"+
	                     "</div><div class='flex-container'>" +
	                    
	                      "</div> "
	               };

	               transporter.sendMail(mailOptions, function(error, info){
	                 if (error) {
	                   console.log(error);
	                 } else {
	                   console.log('Email sent: ' + info.response);
	                 }
	               });
	                user.local.password = user.generateHash(password);
	                  user.save(function(err) {
	                      if (err)
	                    	  console.log(err);
	                      return callback(null, user);
	                  });
	              }
	          });
	      });

	  }));
passport.use(new GoogleStrategy({
	clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
    passReqToCallback : true
  },
  
  function(request, accessToken, refreshToken, profile, done) {
	  process.nextTick(function() {
         console.log(profile);
          User.findOne({ 'local.email':profile.email }, function(err, user) {
              if (err)
                  return done(err);
              if (user) {
                  return done(null, user);
              } else {
                  var user = new User();
                  user.local.id= profile.id;
                  user.local.username = profile.displayName;
                  user.local.email = profile.email; 
                  user.local.provider=profile.provider;
 var password= Math.floor((1 + Math.random()) * 0x10000).toString(4).substring(1);
                  
                  var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                   user: 'sampletask04@gmail.com',
                   pass: 'sampletask004'
                 }
               });

               var mailOptions = {
                 from: 'sampletask04@gmail.com',
                 to: profile.emails[0].value,
                 subject: 'Sending User Credential',
                 html:
                     "<header align='center'>" 
                      "</header> " +
                      "<div align='center'> Hello  <strong>"+ profile.displayName + "</strong>,<br><br> Your local SignIn password : "+password+" you can reset it by login or by forgot password"+
                     "</div><div class='flex-container'>" +
                     
                      "</div> "
               };

               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
                 user.local.password = user.generateHash(password);
                  user.save(function(err) {
                      if (err){
                    	  console.log(err);
                      }else{                          
                      return done(null, user);}
                  });
              }
          });
      });

  }));

passport.use(new tiwtterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL : configAuth.twitterAuth.callbackURL,
}, function(token, tokenSecret, profile, callback) {
	  process.nextTick(function() {
		  console.log(profile);
          User.findOne({'local.email':profile.emails[0].value }, function(err, user) {
              console.log(profile);
        	  if (err)
                  return callback(err);
              if (user) {
                  return callback(null, user);
              } else {
                  var user = new User();
                  user.local.id= profile.id;
                  user.local.userName = profile.displayName;
                  user.local.email = profile.emails[0].value; 
                  user.local.provider=profile.provider;
                  var password= Math.floor((1 + Math.random()) * 0x10000).toString(4).substring(1);
                  
                  var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                   user: 'sampletask04@gmail.com',
                   pass: 'sampletask004'
                 }
               });

               var mailOptions = {
                 from: 'sampletask04@gmail.com',
                 to: profile.emails[0].value,
                 subject: 'Sending User Credential',
                 html:
                     "<header align='center'>" 
                      +
                      "</header> " +
                      "<div align='center'> Hello  <strong>"+ profile.displayName + "</strong>,<br><br> Your local SignIn password : "+password+" you can reset it by login or by forgot password"+
                     "</div><div class='flex-container'>" +
                     
                      "</div> "
               };

               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
                user.local.password = user.generateHash(password);
                  user.save(function(err) {
                      if (err)   if (err){
                    	  console.log(err);
                      }else{                          
                      return done(null, user);} 
      
                  });
              }
          });
      });

  }));
passport.use(new facebookStrategy({
    clientID: '1884192661596682',
    clientSecret:'cebdb1e1a8a1924a2daae5acae159e74',
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, callback) {
	  process.nextTick(function() {
	    
          User.findOne({ 'local.email':profile.emails[0].value }, function(err, user) {
              if (err)
                  return callback(err);
              if (user) {
                  return callback(null, user);
              } else {
                  var user = new User();
                  user.local.id= profile.id;
                  user.local.username = profile.displayName;
                  user.local.email = profile.emails[0].value; 
 var password= Math.floor((1 + Math.random()) * 0x10000).toString(4).substring(1);
                  
                  var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                   user: 'sampletask04@gmail.com',
                   pass: 'sampletask004'
                 }
               });

               var mailOptions = {
                 from: 'sampletask04@gmail.com',
                 to: profile.emails[0].value,
                 subject: 'Sending User Credential',
                 html:
                     "<header align='center'>" +
                     
                      "</header> " +
                      "<div align='center'> Hello  <strong>"+ profile.displayName + "</strong>,<br><br> Your local SignIn password : "+password+" you can reset it by login or by forgot password"+
                     "</div><div class='flex-container'>" +
                     
                      "</div> "
               };

               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
                user.local.password = user.generateHash(password);
                  user.save(function(err) {
                	  if (err){
                    	  console.log(err);
                      }else{                          
                      return done(null, user);}
                  });
              }
          });
      });

  }));
passport.serializeUser(function(user, callback) {
	callback(null, user);
});
passport.deserializeUser(function(obj, callback) {
	callback(null, obj);
});
router.get('/auth/twitter', passport.authenticate('twitter'))

router.get('/twitter/return',function(req,res, next) {
	 passport.authenticate('twitter', function(err, user, info) {
		 if (err) { return next(err); }
		    if (!user) { return res.redirect('/login'); }
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      const token = jwt.sign({ userEmail: user.local.email}, config.secret, { expiresIn: '24h' });          
		      return res.redirect('/dashboard/'+token+'/'+user.local.username);
		    });
		  })(req, res, next);
});
router.get('/auth/google',
		  passport.authenticate('google', { scope: 
		  	[ 'profile','email' ] }
		));
		 
		router.get( '/auth/google/callback',function(req,res, next) {
			 passport.authenticate('google', function(err, user, info) {
				 if (err) { return next(err); }
				    if (!user) { return res.redirect('/login'); }
				    req.logIn(user, function(err) {
				      if (err) { return next(err); }
				      const token = jwt.sign({ userEmail: user.local.email }, config.secret, { expiresIn: '24h' }); 
		                
				      return res.redirect('/dashboard/'+token+'/'+user.local.username);
				    });
				  })(req, res, next);
		});
		router.get('/auth/facebook',
				  passport.authenticate('facebook'));
				router.get('/auth/facebook/callback',function(req,res, next) {
					 passport.authenticate('facebook', function(err, user, info) {
						 if (err) { return next(err); }
						    if (!user) { return res.redirect('/login'); }
						    req.logIn(user, function(err) {
						      if (err) { return next(err); }
						      const token = jwt.sign({ userEmail: user.local.email }, config.secret, { expiresIn: '24h' }); 
				                
						      return res.redirect('/dashboard/'+token+'/'+user.local.username);
						    });
						  })(req, res, next);
				});	  
				router.get('/auth/linkedin',
						  passport.authenticate('linkedin'));

						router.get('/auth/linkedin/callback',function(req,res, next) {
							 passport.authenticate('linkedin', function(err, user, info) {
								 if (err) { return next(err); }
								    if (!user) { return res.redirect('/login'); }
								    req.logIn(user, function(err) {
								      if (err) { return next(err); }
								      const token = jwt.sign({ userEmail: user.local.email }, config.secret,{ expiresIn: '24h' }); 						                
								      return res.redirect('/dashboard/'+token+'/'+user.local.username);
								    });
								  })(req, res, next);
						});	 
module.exports=router;		