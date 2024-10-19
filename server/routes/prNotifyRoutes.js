import express from 'express';
import { runPrNotify } from '../controllers/prNotifyController.js';


const router = express.Router();

router.post('/prnotify', runPrNotify);

// module.exports = router;

export default router;