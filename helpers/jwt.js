// const expressJwt = require('express-jwt');

// function authJwt() {
//     const secret = process.env.secret;
//     const api = process.env.API_URL;
//     return authJwt({
//         secret,
//         algorithms: ['HS256'],
//         isRevoked: isRevoked
//     }).unless({
//         path: [
//             {url: /\/api\/trainers(.*)/ , methods: ['GET', 'OPTIONS'] },
//             {url: /\/api\/users(.*)/ , methods: ['GET', 'OPTIONS'] },
//             `${api}/login`,
//             `${api}/trainer`,
//         ]
//     })
// }

// async function isRevoked(req, payload, done) {
//     if(!payload.isAdmin) {
//         done(null, true)
//     }

//     done();
// }



// module.exports = authJwt