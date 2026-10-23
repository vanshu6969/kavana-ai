param(
    [Parameter(Mandatory=$true)]
    [string]$rawPath,
    [Parameter(Mandatory=$true)]
    [string]$destFileName
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $rawPath)) {
    Write-Error "Source file not found: $rawPath"
    exit 1
}

$rawBytes = [System.IO.File]::ReadAllBytes($rawPath)
$ms = [System.IO.MemoryStream]::new($rawBytes)
$rawImg = [System.Drawing.Image]::FromStream($ms)

$w = 800
$h = 1200
$bmp = [System.Drawing.Bitmap]::new($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Dark background
$bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 8, 10, 18))
$g.FillRectangle($bgBrush, 0, 0, $w, $h)
$bgBrush.Dispose()

# Aspect-fill with smart top-bias for faces
$imgAspect = $rawImg.Width / $rawImg.Height
$targetAspect = $w / $h

if ($imgAspect -gt $targetAspect) {
    $srcHeight = $rawImg.Height
    $srcWidth = [int]($rawImg.Height * $targetAspect)
    $srcX = [int](($rawImg.Width - $srcWidth) / 2)
    $srcY = 0
} else {
    $srcWidth = $rawImg.Width
    $srcHeight = [int]($rawImg.Width / $targetAspect)
    $srcX = 0
    $srcY = [int](($rawImg.Height - $srcHeight) * 0.22)
    if ($srcY -lt 0) { $srcY = 0 }
    if (($srcY + $srcHeight) -gt $rawImg.Height) { $srcY = $rawImg.Height - $srcHeight }
}

$destRect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$srcRect = [System.Drawing.Rectangle]::new($srcX, $srcY, $srcWidth, $srcHeight)
$g.DrawImage($rawImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$rawImg.Dispose()
$ms.Dispose()

# Subtle bottom dark vignette for clean card UI integration (from 850 to 1200)
$pBot1 = [System.Drawing.PointF]::new(0, 850)
$pBot2 = [System.Drawing.PointF]::new(0, 1200)
$cBot1 = [System.Drawing.Color]::FromArgb(0, 8, 10, 18)
$cBot2 = [System.Drawing.Color]::FromArgb(180, 8, 10, 18)
$botGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pBot1, $pBot2, $cBot1, $cBot2)
$g.FillRectangle($botGrad, [System.Drawing.Rectangle]::new(0, 850, $w, 350))
$botGrad.Dispose()

# Subtle top dark vignette (from 0 to 160)
$pTop1 = [System.Drawing.PointF]::new(0, 0)
$pTop2 = [System.Drawing.PointF]::new(0, 160)
$cTop1 = [System.Drawing.Color]::FromArgb(100, 8, 10, 18)
$cTop2 = [System.Drawing.Color]::FromArgb(0, 8, 10, 18)
$topGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pTop1, $pTop2, $cTop1, $cTop2)
$g.FillRectangle($topGrad, [System.Drawing.Rectangle]::new(0, 0, $w, 160))
$topGrad.Dispose()

$g.Dispose()

$encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
$encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]92)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

if (-not (Test-Path "assets")) { New-Item -ItemType Directory -Path "assets" | Out-Null }
if (-not (Test-Path "public/assets")) { New-Item -ItemType Directory -Path "public/assets" -Force | Out-Null }

$bmp.Save("assets/$destFileName", $jpegCodec, $encoderParams)
$bmp.Save("public/assets/$destFileName", $jpegCodec, $encoderParams)

$bmp.Dispose()
$encoderParams.Dispose()
Write-Host "SUCCESS: $destFileName"
