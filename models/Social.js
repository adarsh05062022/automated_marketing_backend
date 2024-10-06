import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// Socials Schema
const SocialsSchema = new Schema({
    platform: {
        type: String,
        required: true,
        default:"instagram"
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure the combination of userId and platform is unique (not the username alone)
SocialsSchema.index({ userId: 1, platform: 1 }, { unique: true });

// Pre-save middleware to hash the password before storing it
SocialsSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
SocialsSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Social = model('Social', SocialsSchema);

export default Social;
