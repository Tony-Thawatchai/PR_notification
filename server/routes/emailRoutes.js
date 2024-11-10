// create API route to get single email, add, update, delete email addresses to the mailing list

import express from 'express';
import { getEmails, getEmail, addEmail, updateEmail, deleteEmail } from '../controllers/emailController.js';

const router = express.Router();

router.get('/getall', getEmails);
router.get('/get', getEmail);
router.post('/add', addEmail);
router.put('/update', updateEmail);
router.delete('/delete', deleteEmail);

export default router;
