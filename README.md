# Cloudflare R2 Pre-signed URL Service

A lightweight Node.js backend to generate pre-signed URLs for direct client-side uploads and downloads to Cloudflare R2. This avoids routing heavy media files through your server, providing better performance and lower costs.

## Features
- **Secure**: Credentials are never exposed to the client.
- **Efficient**: Direct client-to-R2 communication.
- **Simple**: Easy-to-use JSON API.
- **CORS Enabled**: Ready to be consumed by mobile apps or web frontends.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A Cloudflare R2 bucket.
- R2 API Credentials (Access Key, Secret Key, and Account ID).

### 2. Installation
```bash
# Clone or download the repository
cd url-r2

# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
PORT=3000
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

### 4. Run the Server
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

---

## 📡 API Documentation

### 1. Generate Upload URL
**Endpoint:** `POST /generate-upload-url`  
**Description:** Generates a pre-signed PUT URL for uploading a file directly to R2.

**Request Body:**
```json
{
  "fileName": "path/to/my-file.jpg",
  "contentType": "image/jpeg"
}
```

**Response (200 OK):**
```json
{
  "uploadUrl": "https://signed-url-for-upload..."
}
```

### 2. Generate Download URL
**Endpoint:** `GET /generate-download-url`  
**Description:** Generates a pre-signed GET URL for downloading or viewing a file.

**Query Parameters:**
- `fileName`: The object key in your bucket (e.g., `?fileName=path/to/my-file.jpg`)

**Response (200 OK):**
```json
{
  "downloadUrl": "https://signed-url-for-download..."
}
```

### 3. Health Check
**Endpoint:** `GET /health`  
**Response:** `{"status": "ok"}`

---

## 🛠 Usage Example (JavaScript/Fetch)

### Uploading a File
First, get the signed URL:
```javascript
const response = await fetch('http://localhost:3000/generate-upload-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fileName: 'media/photo.jpg', contentType: 'image/jpeg' })
});
const { uploadUrl } = await response.json();

// Now upload directly to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: myFileBlob,
  headers: { 'Content-Type': 'image/jpeg' }
});
```
