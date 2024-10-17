import Social from '../models/Social.js';
import { decryptPassword, encryptPassword } from '../utils/encryption.js';

// Fetch social account and decrypt password
export const GetSocial = async (userId, platform = 'instagram') => {
    try {
        // Find the social account for the user
        const socialAccount = await Social.findOne({ userId, platform });

        if (!socialAccount) {
            console.log('No social account found for this user.');
            return { message: 'No social account found.' };
        }

        // Log the social account details

        if (!socialAccount.iv || !socialAccount.password) {
            throw new Error('Missing IV or password for decryption.');
        }


        // Decrypt the password using the stored IV
        const decryptedPassword = decryptPassword(socialAccount.password, socialAccount.iv);

        // Log the decrypted password

        return {
            username: socialAccount.username,
            password: decryptedPassword,
            platform: socialAccount.platform,
            message: 'Social account retrieved successfully!',
        };
    } catch (error) {
        console.error('Error retrieving social account:', error);
        throw new Error('Error retrieving social account: ' + error.message);
    }
};

// Register or update the social account
export const registerOrUpdateSocialAccount = async (username, password, userId) => {
    const platform = "instagram";
    try {
        // Find the existing social account by userId and platform
        let socialAccount = await Social.findOne({ userId, platform });

        // Encrypt the password to get iv and encryptedPassword
        const { iv, encryptedPassword } = encryptPassword(password);

        if (socialAccount) {
            // If account exists, update it
            socialAccount.username = username;
            socialAccount.password = encryptedPassword; // Update to the encrypted password
            socialAccount.iv = iv; // Set the iv as well
            await socialAccount.save();
            console.log('Social account updated successfully!');
            return { message: 'Social account updated successfully!' };
        } else {
            // If no account exists, create a new one
            const newSocial = new Social({
                platform,
                username,
                password: encryptedPassword, // Use the encrypted password
                iv, // Set the iv
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
