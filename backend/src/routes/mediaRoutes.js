import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Media from '../models/Media.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'video/mp4', 'video/webm', 'video/quicktime',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload video or image files only.'));
    }
  },
});

// Helper: Upload buffer to Cloudinary via stream
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// GET /api/media — List all media items (newest first)
router.get('/', async (_req, res) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Failed to fetch media:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch media items.' });
  }
});

// POST /api/media — Upload new media
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, tagline, description, type, size } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    let cloudinaryUrl = req.body.url; // fallback for direct URL entry
    let cloudinaryId = `manual_${Date.now()}`;

    // If a file was uploaded, push it to Cloudinary
    if (req.file) {
      const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        resource_type: resourceType,
        folder: 'connect2air/media',
        transformation: resourceType === 'image'
          ? [{ width: 1080, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }]
          : undefined,
      });
      cloudinaryUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    }

    if (!cloudinaryUrl) {
      return res.status(400).json({ success: false, message: 'No file or URL provided.' });
    }

    const mediaItem = await Media.create({
      title,
      tagline: tagline || '',
      description: description || '',
      type: type || (req.file?.mimetype.startsWith('video/') ? 'video' : 'image'),
      url: cloudinaryUrl,
      cloudinaryId,
      aspectRatio: 'portrait',
      size: size || 'reel',
    });

    res.status(201).json({ success: true, data: mediaItem });
  } catch (err) {
    console.error('Failed to upload media:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed.' });
  }
});

// PATCH /api/media/:id — Update metadata only (no re-upload)
router.patch('/:id', async (req, res) => {
  try {
    const { title, tagline, description } = req.body;
    const updated = await Media.findByIdAndUpdate(
      req.params.id,
      { title, tagline, description },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Media not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update media:', err);
    res.status(500).json({ success: false, message: 'Update failed.' });
  }
});

// DELETE /api/media/:id — Delete from Cloudinary + MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Media not found.' });

    // Delete from Cloudinary (skip manual URL entries)
    if (item.cloudinaryId && !item.cloudinaryId.startsWith('manual_')) {
      const resourceType = item.type === 'video' ? 'video' : 'image';
      try {
        await cloudinary.uploader.destroy(item.cloudinaryId, { resource_type: resourceType });
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Media deleted.' });
  } catch (err) {
    console.error('Failed to delete media:', err);
    res.status(500).json({ success: false, message: 'Delete failed.' });
  }
});

export default router;
