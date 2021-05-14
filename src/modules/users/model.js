const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required'],
        trim: true
    },
    location: {
        type:  {
            type: String,
            required: [true, 'type is required'],
            trim: true
        },
        coordinates:{
            type: [String],
            required: [true, 'coordinates is required'],
            trim: true
        },
    },
    active: {
        type: Boolean,
        default: true
    },
    roleId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
     },
    userProfile: {
        about: {
            type: String,
            required: [true, 'about is required'],
            trim: true,
        },
        photoURL: {
            type: String,
            required: [true, 'photoURL is required'],
            trim: true,
        },
        coverPhotoURL: {
            type: String,
            required: [true, 'coverPhotoURL is required'],
            trim: true,
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    nickName: {
        type: String,
        required: [true, 'nickName is required'],
        trim: true
    },
    birthDay: {
        type: Number,
        default: null,
        required: false,

    },
    lastLoginDay: {
        type: Number,
        default: null,
        required: false,
    },
    createdDate: {
        type: Number,
        default: Date.now(),
        required: false,
    },
    deletedAt: {
        type: Number,
        default: null,
        required: false,        
    },
    verifiedAccount: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        trim: true,
        default: null
    },
    providerId: {
        type: String,
        trim: true,
        default: null
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user  } = this.toObject();
    return user;
};

module.exports = model( 'User', UserSchema );
