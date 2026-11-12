# MTF Favicon Generator
# =====================================================================
# Run this script ONCE to generate all favicon files from your MTF logo.
# 
# HOW TO RUN:
#   Right-click this file -> "Run with PowerShell"
#   OR open PowerShell in this folder and run: .\generate_favicons.ps1
# =====================================================================

$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host "=== MTF Favicon Generator ===" -ForegroundColor Cyan
Write-Host ""

try {
    Add-Type -AssemblyName System.Drawing

    # Source: the AI-optimized square MTF logo (from artifacts directory)
    $srcPath = "C:\Users\prosp\.gemini\antigravity-ide\brain\5d852850-9257-4290-8ed1-0ac2460a8fc2\mtf_favicon_logo_1783499056355.png"

    # Fallback to the original logo if artifacts image not found
    $originalLogo = "C:\Users\prosp\Desktop\WORK\MTF LOGO PNG\MTF LOGO .png"

    if (Test-Path $srcPath) {
        Write-Host "Using AI-optimized square logo." -ForegroundColor Green
    } elseif (Test-Path $originalLogo) {
        $srcPath = $originalLogo
        Write-Host "Using original MTF logo." -ForegroundColor Yellow
    } else {
        Write-Error "No logo file found. Please check the paths at the top of this script."
        exit 1
    }

    $publicDir = "C:\Users\prosp\Desktop\WEBSITES\MTF Website\Testing\Anti\public"
    $iconsDir  = Join-Path $publicDir "icons"

    if (-not (Test-Path $iconsDir)) {
        New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
    }

    $srcImage = [System.Drawing.Image]::FromFile($srcPath)
    Write-Host "Loaded: $($srcImage.Width) x $($srcImage.Height) px" -ForegroundColor Gray

    function Save-Favicon {
        param(
            [System.Drawing.Image]$Image,
            [int]$Size,
            [string]$OutputPath
        )

        $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
        $g   = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.Clear([System.Drawing.Color]::White)

        # Center-crop source to square
        $cropSz = [Math]::Min($Image.Width, $Image.Height)
        $cropX  = [int](($Image.Width  - $cropSz) / 2)
        $cropY  = [int](($Image.Height - $cropSz) / 2)
        $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSz, $cropSz)
        $dstRect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)

        $g.DrawImage($Image, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()

        Write-Host "  [OK] ${Size}x${Size}  -> $OutputPath" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "Generating favicon sizes..." -ForegroundColor Cyan

    # Main favicon (original full resolution)
    [System.IO.File]::Copy($srcPath, "$publicDir\favicon.png", $true)
    Write-Host "  [OK] favicon.png (full size)" -ForegroundColor Green

    # Browser tab favicons
    Save-Favicon -Image $srcImage -Size 32 -OutputPath "$publicDir\favicon-32x32.png"
    Save-Favicon -Image $srcImage -Size 16 -OutputPath "$publicDir\favicon-16x16.png"

    # PWA / Android icons
    Save-Favicon -Image $srcImage -Size 512 -OutputPath "$iconsDir\icon-512.png"
    Save-Favicon -Image $srcImage -Size 192 -OutputPath "$iconsDir\icon-192.png"

    # Apple touch icon (iOS home screen)
    Save-Favicon -Image $srcImage -Size 180 -OutputPath "$iconsDir\apple-touch-icon.png"

    $srcImage.Dispose()

    Write-Host ""
    Write-Host "=== Done! All favicon files generated ===" -ForegroundColor Green
    Write-Host "Now run 'npm run dev' in your project to see the new favicon." -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkRed
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
