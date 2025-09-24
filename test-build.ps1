# Test build script for debugging GitHub Actions issues
# Run this locally to test the build process

Write-Host "🧪 Testing build process locally..." -ForegroundColor Yellow

# Set environment variables (using fallback values for testing)
$env:PAYLOAD_SECRET = "test-secret-key"
$env:DATABASE_URI = "file:./payload.db"
$env:NEXT_PUBLIC_SERVER_URL = "https://manajemeninformatika.polsri.ac.id"
$env:NODE_ENV = "production"

Write-Host "📝 Environment variables set:" -ForegroundColor Green
Write-Host "- NODE_ENV: $env:NODE_ENV"
Write-Host "- NEXT_PUBLIC_SERVER_URL: $env:NEXT_PUBLIC_SERVER_URL"
Write-Host "- PAYLOAD_SECRET: [REDACTED]"
Write-Host "- DATABASE_URI: [REDACTED]"

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Removed .next directory"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed successfully"

# Build the application
Write-Host "🏗️  Building application..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully"

# Check if standalone directory exists
Write-Host "🔍 Checking build output..." -ForegroundColor Yellow
if (-not (Test-Path ".next\standalone")) {
    Write-Host "❌ Standalone directory not found!" -ForegroundColor Red
    Write-Host "Available .next contents:"
    Get-ChildItem ".next" -ErrorAction SilentlyContinue | Format-Table
    exit 1
}
Write-Host "✅ Standalone directory found"

# Check if server.js exists
if (-not (Test-Path ".next\standalone\server.js")) {
    Write-Host "❌ server.js not found in standalone build!" -ForegroundColor Red
    Write-Host "Standalone contents:"
    Get-ChildItem ".next\standalone" -ErrorAction SilentlyContinue | Format-Table
    exit 1
}
Write-Host "✅ server.js found"

# Run post-build script
Write-Host "🚀 Running post-build script..." -ForegroundColor Yellow
pnpm run post-build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Post-build script failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Post-build script completed"

Write-Host "🎉 All tests passed! The build process should work in GitHub Actions." -ForegroundColor Green
Write-Host "💡 If GitHub Actions still fails, check the repository secrets and variables." -ForegroundColor Cyan