import express from 'express'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { RtcTokenBuilder, RtcRole } = require('agora-token')

const router = express.Router()

// GET /api/v1/agora/token?channel=medicare
router.get('/token', (req, res) => {
  const { channel = 'medicare', uid = 0 } = req.query

  const appId = process.env.AGORA_APP_ID
  const appCertificate = process.env.AGORA_APP_CERTIFICATE

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'Agora credentials not configured' })
  }

  const role = RtcRole.PUBLISHER
  const expireTime = 3600 // 1 hour
  const currentTime = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTime + expireTime

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    parseInt(uid),
    role,
    privilegeExpiredTs,
    privilegeExpiredTs
  )

  res.json({ token, appId, channel })
})

export default router
