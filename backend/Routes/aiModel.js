import express from 'express'
import {getAlldisease, getDiease, postDisease,} from '../Controllers/symptomController.js'
import { predictDisease } from '../Controllers/predictor.js'
const router = express.Router()

router.post('/getprediction',predictDisease)
router.post('/setDisease',postDisease)
router.get('/alldisease',getAlldisease)
router.post('/getdisease',getDiease)

export default router;