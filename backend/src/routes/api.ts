import express from 'express';
import multer from 'multer';
import { analyzeText, analyzeAudio, analyzeImage } from '../controllers/analysis';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/analyze/text', analyzeText);
router.post('/analyze/audio', upload.single('audio'), analyzeAudio);
router.post('/analyze/image', upload.single('image'), analyzeImage);

export default router;
