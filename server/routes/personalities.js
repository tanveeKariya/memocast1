import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getPersonalities,
  createPersonality,
  updatePersonality,
  deletePersonality,
  switchPersonality
} from '../controllers/personalitiesController.js';

const router = express.Router();

router.get('/', auth, getPersonalities);
router.post('/', auth, createPersonality);
router.put('/:id', auth, updatePersonality);
router.delete('/:id', auth, deletePersonality);
router.put('/switch/:id', auth, switchPersonality);

export default router;