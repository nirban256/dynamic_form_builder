import express from 'express';
import { getBases, getTables } from '../controllers/airtableController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/bases', authMiddleware, getBases);
router.get('/bases/:baseId/tables', authMiddleware, getTables);

export default router;