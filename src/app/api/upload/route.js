import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import nc from "next-connect";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Multer setup (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });

const handler = nc()
  .use(upload.fields([{ name: "file" }, { name: "userId" }])) // Accepts file + userId
  .post(async (req, res) => {
    try {
      const userId = req.body.userId; // ✅ Extract userId correctly

      console.log('user: ', userId)

      if (!req.files["file"] || !userId) {
        return res.status(400).json({ error: "File and userId are required" });
      }

      const file = req.files["file"][0]; // Get the uploaded file
      const fileBuffer = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      // Upload to Cloudinary under "uploads/{userId}/files"
      const uploadResult = await cloudinary.uploader.upload(fileBuffer, {
        folder: `uploads/${userId}/files`,
        resource_type: "auto",
      });

      res.status(200).json({ url: uploadResult.secure_url });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: false, // ✅ Required for Multer
  },
};
