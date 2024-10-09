require('dotenv').config();

module.exports = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: process.env.REDIRECT_URI, 
    instagramAppId: process.env.INSTAGRAM_APP_ID,
    instagramAppSecret: process.env.INSTAGRAM_APP_SECRET,
    instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI
};
