const User = require('../model/user'); 
const jwt = require('jsonwebtoken'); 
const config = require('../config/database'); 

module.exports = (router) => {
 
  
  router.post('/login', (req, res) => {
    
    if (!req.body.email) {
      res.json({ success: false, message: 'No email was provided' }); 
    } else {
     
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); 
      } else {
        
        User.findOne({'local.email': req.body.email }, (err, user) => {
          
          if (err) {
            res.json({ success: false, message: err }); 
          } else {
            
            if (!user) {
              res.json({ success: false, message: 'Email not found.' }); 
            } else {
            	console.log(user);
              const validPassword = user.validPassword(req.body.password); 
               console.log(validPassword);
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); 
              } else {
 User.findOneAndUpdate({_id:user._id},{$set:{"local.onlineStatus":'Y'}},function(err,data){
  if(err){
    console.log("error");
    }
    else
    {
      console.log("updated")
      console.log(data)

    }
});
                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); 
                res.json({ success: true, message: "welcome "+user.local.username, token: token, user: { username: user.local.username ,id:user._id}}); 
              }
            }
          }
        });
      }
    }
  });


  router.use((req, res, next) => {
    const token = req.headers['authorization']; 
    if (!token) {
      res.json({ success: false, message: 'No token provided' });
    } else {
     
      jwt.verify(token, config.secret, (err, decoded) => {
      
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); 
        } else {
          req.decoded = decoded; 
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
    User.findOne({ '_id': req.decoded.userId }).select('username email').exec((err, user) => {
      if (err) {
        res.json({ success: false, message: err }); 
      } else {
        
        if (!user) {
          res.json({ success: false, message: 'User not found' }); 
        } else {
          res.json({ success: true, user: user });
        }
      }
    });
  });

  return router; 
}