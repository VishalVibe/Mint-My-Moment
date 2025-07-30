# Vercel Deployment Guide

This guide will help you deploy MintMyMoment to Vercel.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mintmymoment)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your API keys

## 🔧 Step-by-Step Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "mintmymoment" repository

### 2. Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### 3. Set Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables
\`\`\`
NEXT_PUBLIC_CANISTER_ID=your-canister-id-from-icp
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key
\`\`\`

#### Optional Variables
\`\`\`
NEXT_PUBLIC_IC_HOST=https://mainnet.dfinity.network
NODE_ENV=production
\`\`\`

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## 🔄 Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## 🌐 Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## 📊 Monitoring

Vercel provides:
- **Analytics**: User metrics and performance
- **Functions**: API route monitoring  
- **Speed Insights**: Core Web Vitals
- **Logs**: Real-time application logs

## 🔧 Advanced Configuration

### Custom Build Command

If you need custom build steps:

\`\`\`json
// vercel.json
{
  "buildCommand": "npm run build && npm run generate-sitemap"
}
\`\`\`

### Environment-Specific Variables

Set different values for preview vs production:

1. Go to Environment Variables
2. Select environment scope:
   - Production
   - Preview  
   - Development

### Headers and Redirects

Configure in `vercel.json`:

\`\`\`json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
\`\`\`

## 🚨 Troubleshooting

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Test locally** with `npm run build`

### Runtime Errors

1. **Check function logs** in Vercel dashboard
2. **Verify API endpoints** are working
3. **Check network requests** in browser dev tools

### Performance Issues

1. **Enable Speed Insights** in project settings
2. **Optimize images** using Next.js Image component
3. **Use static generation** where possible

## 📈 Optimization Tips

### Performance
- Enable Vercel Speed Insights
- Use Next.js Image optimization
- Implement proper caching headers

### SEO
- Add meta tags and Open Graph data
- Generate sitemap automatically
- Use semantic HTML structure

### Security
- Set proper CSP headers
- Validate all user inputs
- Use HTTPS everywhere

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

## 🆘 Support

If you encounter issues:

1. Check [Vercel Status](https://vercel-status.com/)
2. Review [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Contact Vercel Support through dashboard

---

Your MintMyMoment platform will be live and scalable on Vercel! 🎉
