# Deployment Guide for Takamul

This guide explains how to deploy the Takamul React application to GitHub Pages using GitHub Actions.

## Prerequisites
1. A GitHub account.
2. The project pushed to a GitHub repository.

## Step 1: Configure Vite base URL
Open `vite.config.js` and add the `base` property. 
**Important**: If you are deploying to `https://<USERNAME>.github.io/<REPO>/`, set base to `'/<REPO>/'`. If deploying to a custom domain or root, set it to `'/'`.

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/your-repo-name/', // Uncomment and replace if using project pages
})
```

## Step 2: Create GitHub Action Workflow
Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 3: Enable GitHub Pages
1. Go to your repository **Settings**.
2. Scroll down to the **Pages** section (or click "Pages" in the sidebar).
3. Under **Build and deployment**, select **GitHub Actions** as the source.

## Step 4: Push and Deploy
1. Commit and push your changes to the `main` branch.
2. The Action will automatically trigger, build your app, and deploy it.
3. You can verify the progress in the **Actions** tab of your repository.
