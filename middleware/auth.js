const jwt = require('jsonwebtoken');


SECRET = process.env.SECRET
const Auth = {
    verifyToken(req, res, next){
        console.log(token);
        if (token) {
          // 12. Lalukan jwt verify
          const verified = jwt.verify(token, SECRET);
          req.verified = verified
          if (verified) {
            res.send("verify succeded");
            return next();
          } else {
            //access denied
            return res.status(401).send(err);
          }
        } else {
          res.status(403).send({message: 'Youre not authenticated, please login first'})
            console.log('Youre not authenticated');
        }
    
  }
}

module.exports = Auth;