# Vercel Deployment Guide

This guide will help you deploy the StudioFund application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository access
- Environment variables (if any)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Select the branch you want to deploy (e.g., `copilot/sub-pr-1`)
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your branch:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Configuration

The project includes:
- `vercel.json` - Vercel configuration file
- `.vercelignore` - Files to exclude from deployment

## Environment Variables

If your application requires environment variables:

1. In Vercel Dashboard, go to: Project Settings → Environment Variables
2. Add your variables:
   - `NEXT_PUBLIC_*` variables are exposed to the browser
   - Other variables are server-side only

Common variables you might need:
- Firebase configuration (if using Firebase features)
- API keys
- Database URLs

## Build Configuration

The project is configured with:
- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Post-Deployment

After deployment, Vercel will provide:
- A production URL (e.g., `your-project.vercel.app`)
- Automatic HTTPS
- Global CDN distribution
- Automatic deployments on git push

## Troubleshooting

### Build Errors
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### TypeScript Errors
The project has `ignoreBuildErrors: true` in `next.config.ts` to allow deployment with TypeScript warnings.

### Environment Variables
Make sure all required environment variables are set in Vercel Dashboard before deployment.

## Branch Deployments

Vercel automatically creates preview deployments for each branch and pull request. Each push to your branch will trigger a new deployment.

- **Preview URL**: Each branch gets a unique URL
- **Production**: Assigned to your main branch (usually `main` or `master`)

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS settings as instructed by Vercel

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
