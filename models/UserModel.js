import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: '',
    },
    accessToken: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,

});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
};
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;