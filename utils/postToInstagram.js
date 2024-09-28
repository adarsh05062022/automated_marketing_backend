import { IgApiClient } from "instagram-private-api";
import sharp from "sharp";

const postToInsta = async (IG_USERNAME, IG_PASSWORD) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME);

  try {
    await ig.account.login(IG_USERNAME, IG_PASSWORD);
    // Resize and convert the image to JPEG
    const imageBuffer = await sharp("./myPicture.png")
      .resize({ width: 1080, height: 1080, fit: "inside" })
      .jpeg()
      .toBuffer();

    await ig.publish.photo({
      file: imageBuffer,
      caption: "Really nice photo from the internet!",
    });

    console.log("Posted successfully");
    return true;
  } catch (error) {
    console.error("Failed to login:", error);
    return false;
  }
};




export default postToInsta;
