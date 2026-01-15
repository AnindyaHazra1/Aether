const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate Token
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET || 'fallback_secret_key_123',
            { expiresIn: '7d' }
        );

        res.status(201).json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        // Increment login count
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET || 'fallback_secret_key_123',
            { expiresIn: '7d' }
        );

        res.json({ user, token });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET ME (Protected)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE PROFILE (Protected)
router.put('/me', auth, async (req, res) => {
    try {
        console.log("PUT /me Called. Body:", req.body);
        const { location, dob, phone, avatarId } = req.body;
        const updates = {};

        if (location !== undefined) updates.location = location;
        if (avatarId !== undefined) updates.avatarId = avatarId;
        if (phone !== undefined) updates.phone = phone;

        // Handle Date of Birth
        if (dob !== undefined) {
            updates.dob = dob === '' ? null : dob;
        }

        console.log("Updates to apply:", updates);

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);

    } catch (error) {
        console.error("PUT /me Error:", error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// ADD FAVORITE
router.post('/me/favorites', auth, async (req, res) => {
    try {
        const { city } = req.body;
        console.log(`[DEBUG] Attempting to add favorite: ${city} for user ${req.user._id}`);
        if (!city) return res.status(400).json({ error: 'City is required' });

        const trimmedCity = city.trim();
        const user = await User.findById(req.user._id);

        console.log(`[DEBUG] Current favorites count: ${user.savedLocations.length}`);
        console.log(`[DEBUG] Current favorites: ${JSON.stringify(user.savedLocations)}`);

        // Case-insensitive check to prevent duplicates like "London" and "london"
        const exists = user.savedLocations.some(loc => loc.toLowerCase() === trimmedCity.toLowerCase());

        if (!exists) {
            if (user.savedLocations.length >= 3) {
                console.log(`[DEBUG] Limit reached (>=3). Rejecting.`);
                return res.status(400).json({ error: 'You can only save up to 3 locations' });
            }
            user.savedLocations.push(trimmedCity);
            await user.save();
            console.log(`[DEBUG] Added successfully. New count: ${user.savedLocations.length}`);
        } else {
            console.log(`[DEBUG] City already exists.`);
        }
        res.json(user.savedLocations);
    } catch (error) {
        console.error(`[DEBUG] Error in /me/favorites:`, error);
        res.status(500).json({ error: 'Server error' });
    }
});

// REMOVE FAVORITE
router.delete('/me/favorites/:city', auth, async (req, res) => {
    try {
        const { city } = req.params;
        const user = await User.findById(req.user._id);
        user.savedLocations = user.savedLocations.filter(c => c !== city);
        await user.save();
        res.json(user.savedLocations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// FILE UPLOAD SETUP
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // user_id_timestamp.ext
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// UPLOAD AVATAR
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatarId: avatarUrl }, // Reusing avatarId field to store the URL
            { new: true }
        ).select('-password');

        res.json(user);

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message || 'Error uploading file' });
    }
});

// DELETE AVATAR
router.delete('/me/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Optional: Delete the file if it exists and is locally stored
        if (user.avatarId && user.avatarId.startsWith('/uploads')) {
            const filePath = path.join(__dirname, '..', user.avatarId);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        user.avatarId = 'default';
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
