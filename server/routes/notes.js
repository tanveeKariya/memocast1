import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  moveNote,
  deleteNote,
  enhanceNote,
  enhanceContent,
  getFile,
  getStats
} from '../controllers/notesController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Notes routes
router.get('/', auth, getNotes);
router.get('/stats/overview', auth, getStats);
router.get('/files/:id', auth, getFile);
router.get('/:id', auth, getNote);
router.post('/', auth, upload.array('attachments', 10), createNote);
router.put('/:id', auth, updateNote);
router.put('/:id/move', auth, moveNote);
router.delete('/:id', auth, deleteNote);
router.post('/:id/enhance', auth, enhanceNote);
router.post('/enhance', auth, enhanceContent);

export default router;