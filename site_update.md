# AgentFlow Website - How to Update and Deploy

## 🔄 Your Current Setup:

**Local Files** → **GitHub** → **Google Cloud** → **www.goagentflow.com**

Here's exactly what happens when you want to make changes:

## 📝 Making Changes - 3 Easy Steps:

### 1. **Make Changes Locally**
- Edit files in `/Users/hamishnicklin/Desktop/New_AF_Site/`
- Or ask Claude to make changes for you (like we've been doing)

### 2. **Push to GitHub (Optional but Recommended)**
```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

### 3. **Deploy to Live Website**
```bash
gcloud builds submit --config cloudbuild.yaml
```
That's it! Your changes are live in ~1 minute.

## 🚨 Important Notes:

### **Netlify is NOT involved anymore**
- Your old workflow used Netlify
- Your new website bypasses Netlify completely
- Changes go: Local → GitHub → Google Cloud

### **GitHub is optional for deployment**
- GitHub is just for backup/version control
- The live website deploys directly from your local files
- You could skip GitHub if you want, but I recommend keeping it

## 🛠 Common Change Examples:

### **Text Changes:**
1. Edit `index.html` (or ask Claude to)
2. Run: `gcloud builds submit --config cloudbuild.yaml`
3. Done!

### **Styling Changes:**
1. Edit `css/style.css` 
2. Run: `gcloud builds submit --config cloudbuild.yaml`
3. Done!

### **New Features:**
1. Make changes to any files
2. Run: `gcloud builds submit --config cloudbuild.yaml`
3. Done!

## 🎯 Super Simple Workflow:
1. **Make changes** (either yourself or through Claude)
2. **Deploy**: `gcloud builds submit --config cloudbuild.yaml`
3. **Check**: Visit www.goagentflow.com (changes live in ~1 minute)

No Netlify, no complex setup - just one command to deploy!

## 📁 Key Files:
- `index.html` - Main website content
- `css/style.css` - Website styling
- `js/main.js` - Website functionality
- `cloudbuild.yaml` - Deployment configuration
- `Dockerfile` - Container configuration
- `nginx.conf` - Web server configuration

## 🌐 Live Website:
https://www.goagentflow.com

## 🔧 Prerequisites:
- Google Cloud CLI installed and authenticated
- Docker Desktop running (for local testing if needed)

---
*Created: September 2025*
*Last Updated: September 2025*