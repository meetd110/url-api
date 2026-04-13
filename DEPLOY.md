# 🚀 Deployment Guide: YouSafe R2 API

Follow these steps to put your API online permanently so your friend can use it.

## 1. Push to GitHub
If you haven't already, you'll need to push this project to a GitHub repository.
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project folder:
   ```powershell
   git init
   git add .
   git commit -m "Complete API with dashboard"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 2. Deploy to Render.com
Render is a free and easy way to host Node.js apps.
1. Sign up/Login at [Render.com](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Use these settings:
   - **Name:** `yousafe-r2-api` (or any unique name)
   - **Region:** Choose the one closest to you.
   - **Branch:** `main`
   - **Root Directory:** (leave blank)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

## 3. Configure Environment Variables
**This is the most important step!** 
In the Render dashboard, go to the **Environment** tab and add the keys from your `.env` file:
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

## 4. Share with your Friend
Once the status is **"Live"**, Render will give you a URL like `https://yousafe-r2-api.onrender.com`. 
Send this URL to your friend. They can open it in their browser to use the Dashboard or use it as an API endpoint!

---
💡 **Note:** On the Free tier, the app will "sleep" if not used for 15 minutes. The first request after a sleep might take ~30 seconds to wake up.
