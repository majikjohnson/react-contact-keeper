const jwt = require('jsonwebtoken');



module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: 'No auth token.  Access Denied.'});

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}