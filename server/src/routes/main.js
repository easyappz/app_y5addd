const express = require('express');
const authController = require('@src/controllers/authController');
const photoController = require('@src/controllers/photoController');
const authMiddleware = require('@src/middleware/auth');
const upload = require('@src/middleware/multerConfig');

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/auth/check', authMiddleware, authController.checkAuth);
router.post('/logout', authMiddleware, authController.logout);

// Photo routes
router.post('/photo/upload', authMiddleware, upload.single('photo'), photoController.uploadPhoto);
router.get('/photo/rate', authMiddleware, photoController.getPhotosToRate);
router.post('/photo/rate', authMiddleware, photoController.ratePhoto);
router.post('/photo/evaluate/add', authMiddleware, photoController.addToEvaluated);
router.post('/photo/evaluate/remove', authMiddleware, photoController.removeFromEvaluated);
router.get('/photo/statistics/:photoId', authMiddleware, photoController.getPhotoStatistics);

module.exports = router;