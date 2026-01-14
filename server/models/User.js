const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    dob: {
        type: Date
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatarId: {
        type: String,
        default: 'default'
    },
    savedLocations: [{
        type: String,
        trim: true
    }],
    loginCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
