import { IgApiClient } from "instagram-private-api";
import sharp from "sharp";

const postToInsta = async (IG_USERNAME, IG_PASSWORD, imageBase64, caption) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME);

  try {
    await ig.account.login(IG_USERNAME, IG_PASSWORD);

    // Check if the imageBase64 is a valid Base64 string
    if (!/^data:image\/[a-z]+;base64,/.test(imageBase64)) {
      throw new Error('Invalid Base64 string');
    }

    // Extract the base64 part (remove the data URI prefix)
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Decode Base64 image into buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Validate image format with sharp
    const metadata = await sharp(imageBuffer).metadata();
    console.log('Image metadata:', metadata); // For debugging, log the metadata

    if (!metadata.format) {
      throw new Error('Unsupported image format');
    }

    // Resize and prepare image for Instagram
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 1080, height: 1080, fit: "inside" })
      .jpeg() // Convert to JPEG format
      .toBuffer();

    // Post to Instagram
    const { media } = await ig.publish.photo({
      file: resizedImageBuffer,
      caption: caption,
    });

    console.log("Posted successfully");
    return media.id;
  } catch (error) {
    console.error("Failed to post to Instagram:", error.message); // Adjusted error logging
    return null;
  }
};


const getInstagramPostInsights = async (postId, username, password) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);

  await ig.account.login(username, password);

  const insights = await ig.insights.post(postId); // Fetch insights like likes and comments
  return insights;
};

export  {postToInsta,getInstagramPostInsights};
