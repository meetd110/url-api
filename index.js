// index.js
// Entry point — Express server exposing pre-signed URL endpoints for Cloudflare R2.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { generateUploadUrl, generateDownloadUrl } = require("./r2Service");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Startup validation
// ---------------------------------------------------------------------------
// Fail fast if any required environment variable is missing.
const REQUIRED_ENV = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌  Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// POST /generate-upload-url
// ---------------------------------------------------------------------------
// Generates a pre-signed PUT URL for direct client-to-R2 file uploads.
//
// Request body:
//   { "fileName": "userId/incidents/incidentId/file.enc", "contentType": "image/jpeg" }
//
// Response:
//   { "uploadUrl": "https://signed-url..." }
app.post("/generate-upload-url", async (req, res) => {
  const { fileName, contentType } = req.body;

  // --- Input validation ---
  if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {
    return res.status(400).json({ error: "fileName is required and must be a non-empty string." });
  }
  if (!contentType || typeof contentType !== "string" || contentType.trim() === "") {
    return res.status(400).json({ error: "contentType is required and must be a non-empty string." });
  }

  try {
    const uploadUrl = await generateUploadUrl(fileName.trim(), contentType.trim());
    return res.status(200).json({ uploadUrl });
  } catch (err) {
    console.error("Error generating upload URL:", err);
    return res.status(500).json({ error: "Failed to generate upload URL.", details: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /generate-download-url
// ---------------------------------------------------------------------------
// Generates a pre-signed GET URL for direct client-to-R2 file downloads.
//
// Query param:
//   ?fileName=userId/incidents/incidentId/file.enc
//
// Response:
//   { "downloadUrl": "https://signed-url..." }
app.get("/generate-download-url", async (req, res) => {
  const { fileName } = req.query;

  // --- Input validation ---
  if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {
    return res.status(400).json({ error: "fileName query parameter is required and must be a non-empty string." });
  }

  try {
    const downloadUrl = await generateDownloadUrl(fileName.trim());
    return res.status(200).json({ downloadUrl });
  } catch (err) {
    console.error("Error generating download URL:", err);
    return res.status(500).json({ error: "Failed to generate download URL.", details: err.message });
  }
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅  R2 pre-signed URL service running on port ${PORT}`);
});
