const { setGlobalOptions } = require('firebase-functions')
const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const logger = require('firebase-functions/logger')

setGlobalOptions({ maxInstances: 10 })
admin.initializeApp()

exports.deleteSong = onRequest(async (req, res) => {
  const { filePath, docId } = req.body

  if (!filePath || !docId) {
    return res.status(400).send('Missing file path or document ID')
  }

  try {
    // Delete file from storage
    await admin.storage().bucket().file(filePath).delete()
    logger.info(`Deleted file: ${filePath}`)

    // Delete document from Firestore
    await admin.firestore().collection('songs').doc(docId).delete()
    logger.info(`Deleted document: ${docId}`)

    res.status(200).send('Song deleted successfully')
  } catch (error) {
    logger.error('Error deleting song', error)
    res.status(500).send('Failed to delete song')
  }
})

exports.setCors = onRequest(async (req, res) => {
  try {
    const corsConfiguration = [
      {
        origin: [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://localhost:8080',
        ],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: [
          'Content-Type',
          'Authorization',
          'Content-Length',
          'User-Agent',
          'x-goog-resumable',
        ],
      },
    ]

    await admin.storage().bucket().setCorsConfiguration(corsConfiguration)
    logger.info('CORS configuration set successfully')
    res.status(200).send('CORS configuration set successfully')
  } catch (error) {
    logger.error('Error setting CORS configuration', error)
    res.status(500).send('Failed to set CORS configuration')
  }
})
