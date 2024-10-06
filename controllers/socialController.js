import Social from '../models/Social.js';
import bcrypt from 'bcrypt';

export const registerOrUpdateSocialAccount = async (username, password, userId) => {
    const platform = "instagram";
    try {
        // Find the existing social account by userId and platform
        let socialAccount = await Social.findOne({ userId, platform });

        if (socialAccount) {
            // If account exists, update it
            socialAccount.username = username;
            socialAccount.password = password; // The pre-save middleware will hash the new password
            await socialAccount.save();
            console.log('Social account updated successfully!');
            return { message: 'Social account updated successfully!' };
        } else {
            // If no account exists, create a new one
            const newSocial = new Social({
                platform,
                username,
                password,
                userId
            });
            await newSocial.save();
            console.log('Social account created successfully!');
            return { message: 'Social account created successfully!' };
        }
    } catch (error) {
        console.error('Error registering or updating social account:', error);
        throw new Error('Error registering or updating social account: ' + error.message);
    }
};
