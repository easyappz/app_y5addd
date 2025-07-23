const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.points < 1) return res.status(403).json({ error: 'Not enough points to upload photo' });

    const { gender, age } = req.body;
    const photo = new Photo({
      userId,
      url: req.file.path,
      gender,
      age
    });
    await photo.save();

    user.points -= 1;
    await user.save();

    res.status(201).json({ photo, points: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPhotosToRate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gender, ageMin, ageMax } = req.query;
    const query = { userId: { $ne: userId }, isEvaluated: true };

    if (gender) query.gender = gender;
    if (ageMin && ageMax) query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) };

    const photos = await Photo.find(query).limit(10);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ratePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId, score } = req.body;
    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    if (photo.userId.toString() === userId) return res.status(403).json({ error: 'Cannot rate own photo' });

    const rater = await User.findById(userId);
    photo.ratings.push({ userId, score, gender: rater.gender, age: rater.age });

    // Update statistics
    photo.statistics[photo.gender].count += 1;
    photo.statistics[photo.gender].totalScore += score;
    if (rater.age < 20) {
      photo.statistics.ageGroups.under20.count += 1;
      photo.statistics.ageGroups.under20.totalScore += score;
    } else if (rater.age < 30) {
      photo.statistics.ageGroups['20to30'].count += 1;
      photo.statistics.ageGroups['20to30'].totalScore += score;
    } else if (rater.age < 40) {
      photo.statistics.ageGroups['30to40'].count += 1;
      photo.statistics.ageGroups['30to40'].totalScore += score;
    } else {
      photo.statistics.ageGroups.over40.count += 1;
      photo.statistics.ageGroups.over40.totalScore += score;
    }

    await photo.save();

    // Update points
    rater.points += 1;
    const photoOwner = await User.findById(photo.userId);
    photoOwner.points -= 1;
    await rater.save();
    await photoOwner.save();

    res.json({ message: 'Photo rated', raterPoints: rater.points, ownerPoints: photoOwner.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToEvaluated = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.body;
    const user = await User.findById(userId);
    if (user.points < 1) return res.status(403).json({ error: 'Not enough points' });

    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    photo.isEvaluated = true;
    await photo.save();

    user.points -= 1;
    await user.save();

    res.json({ message: 'Photo added to evaluated list', points: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromEvaluated = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.body;
    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    photo.isEvaluated = false;
    await photo.save();

    res.json({ message: 'Photo removed from evaluated list' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPhotoStatistics = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    res.json(photo.statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};