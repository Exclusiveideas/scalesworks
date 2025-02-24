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
  .use(upload.single("file")) // Accepts single file
  .post(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileBuffer, {
        folder: "uploads", // Change folder as needed
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
    bodyParser: false, // Disable default body parser (Multer handles it)
  },
};
