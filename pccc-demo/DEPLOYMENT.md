# PCCC Demo - Deployment Guide

## 🚀 Deploying to DigitalOcean App Platform

### Pre-requisites
1. DigitalOcean account
2. GitHub/GitLab repository with this code
3. OpenRouter API key

### Method 1: Using DigitalOcean App Spec (Recommended)

1. **Push code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Create App on DigitalOcean**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select your repository
   - DigitalOcean will auto-detect the `.do/app.yaml` configuration

3. **Configure Environment Variables**
   In DigitalOcean dashboard, add these secrets:
   - `OPEN_ROUTER_API_KEY`: Your OpenRouter API key

4. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

### Method 2: Manual Configuration

If auto-detection doesn't work:

1. **Create App** → Select your repo
2. **Add Backend Service**:
   - Source Directory: `/`
   - Dockerfile Path: `backend/Dockerfile`
   - HTTP Port: `3000`
   - Routes: `/api`

3. **Add Frontend Service**:
   - Source Directory: `/`
   - Dockerfile Path: `frontend/Dockerfile`
   - HTTP Port: `80`
   - Routes: `/`

## 📋 Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `PORT` | Server port (default: 3000) | No |
| `CORS_ORIGIN` | Frontend URL for CORS | Yes |
| `OPEN_ROUTER_API_KEY` | OpenRouter API key | Yes |

### Frontend (Build-time)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | App display name | No |

## 🧪 Local Docker Testing

```bash
# Build and run backend
cd pccc-demo
docker build -f backend/Dockerfile -t pccc-backend .
docker run -p 3000:3000 -e OPEN_ROUTER_API_KEY=your_key pccc-backend

# Build and run frontend
docker build -f frontend/Dockerfile -t pccc-frontend --build-arg VITE_API_URL=http://localhost:3000 .
docker run -p 80:80 pccc-frontend
```

## 🔧 Troubleshooting

### "No components detected"
- Ensure Dockerfiles exist in correct paths
- Check `.do/app.yaml` is present
- Verify repository permissions

### CORS Issues
- Update `CORS_ORIGIN` in backend to match frontend URL
- Ensure frontend URL doesn't have trailing slash

### Build Failures
- Check `bun.lock` is committed to repository
- Verify all dependencies are listed in `package.json`
