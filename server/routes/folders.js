import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  shareFolder
} from '../controllers/foldersController.js';

const router = express.Router();

router.get('/', auth, getFolders);
router.post('/', auth, createFolder);
router.put('/:id', auth, updateFolder);
router.delete('/:id', auth, deleteFolder);
router.post('/:id/share', auth, shareFolder);

export default router;