import express from 'express';
import { createForm, getFormById, getForms, submitForm } from '../controllers/formController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getForms);
router.post('/', authMiddleware, createForm);
router.get('/:formId', getFormById);
router.post('/:formId/responses', submitForm);

export default router;