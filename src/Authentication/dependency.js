const jwt = require('jsonwebtoken');

function decodeJwt(token) {
    try {
        const data = jwt.verify(token, "12345");
        return data;
    } catch (error) {
        // Handle token verification errors here
        console.error(error);

        // Assuming you want to send a 401 Unauthorized status code for an invalid token
        return { error: 'Invalid Token' };
    }
}

module.exports = decodeJwt;
