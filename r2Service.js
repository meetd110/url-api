// r2Service.js
// Handles S3-compatible client setup for Cloudflare R2 and all signing logic.

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// ---------------------------------------------------------------------------
// R2 Client Configuration
// ---------------------------------------------------------------------------
// Credentials are loaded from environment variables — never hard-coded.
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// ---------------------------------------------------------------------------
// generateUploadUrl
// ---------------------------------------------------------------------------
// Generates a pre-signed PUT URL so the client can upload directly to R2
// without routing the file through this server.
//
// @param {string} fileName    - Object key in the bucket (e.g. "userId/incidents/file.enc")
// @param {string} contentType - MIME type of the file (e.g. "image/jpeg")
// @returns {Promise<string>}  - Pre-signed upload URL (valid for 5 minutes)
async function generateUploadUrl(fileName, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  });

  // URL expires in 5 minutes (300 seconds)
  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
  return signedUrl;
}

// ---------------------------------------------------------------------------
// generateDownloadUrl
// ---------------------------------------------------------------------------
// Generates a pre-signed GET URL so the client can download/view a file
// directly from R2 without proxying through this server.
//
// @param {string} fileName   - Object key in the bucket
// @returns {Promise<string>} - Pre-signed download URL (valid for 5 minutes)
async function generateDownloadUrl(fileName) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
  return signedUrl;
}

module.exports = { generateUploadUrl, generateDownloadUrl };
