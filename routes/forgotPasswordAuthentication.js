var User = require('../model/user'); 
var jwt = require('jsonwebtoken'); 
var secret = 'harrypotter'; 
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport'); 
var router = require('express').Router();


    router.put('/resetpassword', (req, res)=> {
        User.findOne({ 'local.email': req.body.email }).select('local.username local.email local.resettoken').exec((err, user) =>{
            if (err) {
 
            	res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
            	
                if (!user) {
                    res.json({ success: false, message: 'Email was not found' }); 
                
                } else {
                	user.local.resettoken = jwt.sign({ username: user.local.username, email: user.local.email }, secret, { expiresIn: '24h' }); 
                    
                    user.save((err) => {
                        if (err) {
                            res.json({ success: false, message: err }); 
                        } else{
                        	
                        	var transporter = nodemailer.createTransport({
                        	    service: 'gmail',
                        	    port: 465,
                        	    secure: true,
                        	    auth: {
                        	    	user: 'sampletask04@gmail.com',
             	                   pass: 'sampletask004'
                        	    }
                        	});
                           
                            var mailOptions = {
                                          from: 'sampletask04@gmail.com',
                                          to: user.local.email,
                                          subject: 'Reset Password Request',
                                          html:
                                              "<header align='center'>" +
                                             
                                               "</header> " +
                                               "<div align='center'> Hello  <strong>"+ user.local.username + "</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href='http://localhost:4200/reset/"+user.local.resettoken+ "'>Reset link</a>"+
                                              "</div><div class='flex-container'>" +
                                               
                                               "</div> "
                                                            }
                    transporter.sendMail(mailOptions, (err) => {
                     if (err) {
                    console.log(err);
                    res.json({success: false, message: "Something went Wrong please try again"});
                    } else {
                    	res.json({ success: true, message: 'Please check your e-mail for password reset link' }); 
                    }
                    });
                            
                        }
                    });
                }
            }
        });
    });

    // Route to verify user's e-mail activation link
    router.get('/resetpassword/:token', (req, res)=> {
        User.findOne({ 'local.resettoken': req.params.token }).select('local.username local.email local.resettoken').exec((error, user)=> {
            if (error) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                var token = req.params.token;
                
                // Function to verify token
                jwt.verify(token, secret,(err, decoded)=> {
                	
                	console.log(user);
                    if (err) {
                        res.json({ success: false, message: 'Password link has expired' }); 
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'Password link has expired' });
                        } else {
                            res.json({ success: true,message: 'Active link Enter the Password', user: user }); 
                        }
                    }
                });
            }
        });
    });

    // Save user's new password to database
 router.put('/savepassword',(req, res) =>{
	 if (req.body.password === null || req.body.password === '') {
         res.json({ success: false, message: 'Password not provided' });
     }else if(eq.body.resettoken === null || req.body.resettoken === '') {
    	 res.json({ success: false, message: 'password link expired' });
     }else{
        User.findOne({ 'local.resettoken': req.body.resettoken }).select().exec((err, user)=> {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                    user.local.password =user.generateHash(req.body.password); 
                    user.local.resettoken = false; 
                    user.save((err,info) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                        	var transporter = nodemailer.createTransport({
                        	    service: 'gmail',
                        	    port: 465,
                        	    secure: true,
                        	    auth: {
                        	    	user: 'sampletask04@gmail.com',
             	                    pass: 'sampletask004'
                        	    }
                        	});
                           
                            var mailOptions = {
                                          from: 'sampletask04@gmail.com',
                                          to: user.local.email,
                                          subject: 'Reset Password Request',
                                          html:
                                              "<header align='center'>" +
                                               +
                                               "<div align='center'> 'Hello  <strong> ' "+ user.local.username +" '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com"+
                                              "</div><div class='flex-container'>" +
                                               +
                                               "</div> "
                                                            }
                    transporter.sendMail(mailOptions, (err) =>{
                     if (err) {
                    console.log(err);
                    res.json({success: false, message: "Something went Wrong please try again"});
                    } else {
                    	  res.json({ success: true, message: 'Password has been reset!' }); 
                    }
                    });
                                             
                        }
                    
                    });
                }
            
        });
     }
});
 module.exports = router;