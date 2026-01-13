# Deploy Assistly AI to Vercel

This guide will help you deploy your Assistly AI application to Vercel for Twilio verification.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your project pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit - Assistly AI"
git branch -M main
git remote add origin https://github.com/yourusername/assistly-ai.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. **Go to Vercel**: Visit https://vercel.com and sign in (or create an account)

2. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your `assistly-ai` repository

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**:
   Click "Environment Variables" and add all your variables from `.env.local`:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_API_KEY=your_google_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=noreply@assistly.ai
   VAPI_API_KEY=your_vapi_api_key
   ```

   **Important**: 
   - Update `NEXT_PUBLIC_SITE_URL` to your Vercel deployment URL (you'll get this after first deploy)
   - Select all environments (Production, Preview, Development)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

## Step 3: Get Your Deployment URL

After deployment completes, Vercel will provide you with:
- **Production URL**: `https://your-project-name.vercel.app`
- This is your live website URL!

## Step 4: Update Environment Variables

1. Go back to your Vercel project settings
2. Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
   ```
3. Redeploy (or it will auto-redeploy on next push)

## Step 5: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client ID
3. Add your Vercel URL to Authorized Redirect URIs:
   ```
   https://your-project-name.vercel.app/api/auth/google-calendar/callback
   ```

## Step 6: Use for Twilio Verification

Your live URLs for Twilio verification:

- **Homepage**: `https://your-project-name.vercel.app`
- **Privacy Policy**: `https://your-project-name.vercel.app/privacy`
- **Terms of Service**: `https://your-project-name.vercel.app/terms`

## Custom Domain (Optional)

If you want a custom domain:

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain (e.g., `assistly.ai`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches (for testing)

## Troubleshooting

- **Build fails**: Check build logs in Vercel dashboard
- **Environment variables not working**: Make sure they're set for the correct environment
- **404 errors**: Check that your routes are correct in the `app` directory
- **API routes not working**: Ensure environment variables are set correctly

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
