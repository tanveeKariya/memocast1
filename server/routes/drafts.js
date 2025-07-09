import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  publishDraft,
  shareDraft
} from '../controllers/draftsController.js';

const router = express.Router();

router.get('/', auth, getDrafts);
router.post('/', auth, createDraft);
router.put('/:id', auth, updateDraft);
router.delete('/:id', auth, deleteDraft);
router.post('/:id/publish', auth, publishDraft);
router.post('/:id/share', auth, shareDraft);

export default router;