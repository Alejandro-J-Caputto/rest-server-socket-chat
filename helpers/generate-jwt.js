const jwt = require('jsonwebtoken');

exports.generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(payload, process.env.PRIVATEPOTATOE, {
      expiresIn: '24h'
    }, (err, token) => {
      if ( err ) {
        console.log(object)
        reject('The token could not be created')
      } else {
        resolve( token );
      }
    })
  })
}

exports.generateCOOKIE = (token, res) => {
  return new Promise((resolve) => {
    const cookieOptions =  {
      expires: new Date(Date.now()
      + process.env.JWT_COOKIE_EXPIRES_IN
      * 24 * 60 * 60 * 1000),
      httpOnly: true //seguridad para que no se pueda manipular
   }
    resolve (res.cookie('jwt-cookie-cafe', token, cookieOptions));

  })
}
