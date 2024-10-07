require('dotenv').config();

module.exports = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: process.env.REDIRECT_URI, 
};
