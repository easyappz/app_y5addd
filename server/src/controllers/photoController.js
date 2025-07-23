const path = require('path');
const fs = require('fs');
const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Only JPEG and PNG files are allowed' });
    }

    if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    const photo = new Photo({
      userId: req.user.id,
      filePath: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photoId: photo._id });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Photo upload failed', details: error.message });
  }
};

exports.getPhotosToRate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const photos = await Photo.find({
      userId: { $ne: req.user.id },
      _id: { $nin: user.evaluatedPhotos }
    }).limit(10);

    res.json(photos.map(photo => ({
      id: photo._id,
      filePath: `/uploads/${path.basename(photo.filePath)}`
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos', details: error.message });
  }
};

exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate your own photo' });
    }

    const alreadyRated = photo.ratings.some(rating => rating.userId.toString() === req.user.id);
    if (alreadyRated) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }

    photo.ratings.push({ userId: req.user.id, score });
    await photo.save();

    res.json({ message: 'Photo rated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Rating failed', details: error.message });
  }
};

exports.addToEvaluated = async (req, res) => {
  try {
    const { photoId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.evaluatedPhotos.includes(photoId)) {
      user.evaluatedPhotos.push(photoId);
      await user.save();
    }
    res.json({ message: 'Photo added to evaluated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add photo to evaluated', details: error.message });
  }
};

exports.removeFromEvaluated = async (req, res) => {
  try {
    const { photoId } = req.body;
    const user = await User.findById(req.user.id);
    user.evaluatedPhotos = user.evaluatedPhotos.filter(id => id.toString() !== photoId);
    await user.save();
    res.json({ message: 'Photo removed from evaluated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove photo from evaluated', details: error.message });
  }
};

exports.getPhotoStatistics = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to photo statistics' });
    }

    const ratings = photo.ratings.map(r => r.score);
    const average = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    res.json({
      totalRatings: ratings.length,
      averageScore: average.toFixed(2),
      scores: ratings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo statistics', details: error.message });
  }
};