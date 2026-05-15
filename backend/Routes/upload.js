import express from 'express'
import multer from 'multer'
import { Blockchain, deleteEHR, getAllehr, getBlockchainEHR, getEHR, uploadFile } from '../Controllers/ehrController.js';
import { authenticate } from '../Auth/verifyToken.js';

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage , limits :{ fileSize : 5*1024*1024 }});


router.get('/',getAllehr)
router.get('/file',authenticate,getEHR)
router.post('/file',authenticate,upload.single('filename') ,Blockchain)
router.delete('/file',authenticate,deleteEHR)
export default router