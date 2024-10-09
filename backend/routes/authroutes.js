const express = require('express');
const authControllers = require('../controllers/authcontroller');
const router = express.Router();

// Route to initiate Facebook OAuth
router.get('/facebook/login', authControllers.facebookLogin);

// Route to handle the callback for Facebook
router.get('/facebook/callback', authControllers.facebookCallback);

// Route to initiate Instagram OAuth
router.get('/instagram/login', authControllers.instagramLogin);

// Route to handle the callback for Instagram
router.get('/instagram/callback', authControllers.instagramCallback);

module.exports = router;
