Add-Type -AssemblyName System.Drawing

$json = [System.IO.File]::ReadAllText("scratch/render_list.json")
$items = ConvertFrom-Json $json

$w = 800
$h = 1200

$fontBrand = [System.Drawing.Font]::new("Arial", [float]11.0, [System.Drawing.FontStyle]::Bold)
$fontTitle = [System.Drawing.Font]::new("Georgia", [float]29.0, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new("Palatino Linotype", [float]18.0, [System.Drawing.FontStyle]::Bold)
$fontChar = [System.Drawing.Font]::new("Georgia", [float]19.0, [System.Drawing.FontStyle]::Bold)
$fontBadge = [System.Drawing.Font]::new("Arial", [float]11.0, [System.Drawing.FontStyle]::Bold)

$brushShadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(235, 0, 0, 0))
$brushWhite = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$brushGold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 225, 178, 80))
$brushGoldLight = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 245, 225, 160))

$sf = [System.Drawing.StringFormat]::new()
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
$encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]93)

Write-Host "Rendering $($items.Count) cinematic romance posters with love_villa styling..."

$count = 0
foreach ($it in $items) {
    $count++
    $rawPath = $it.rawPath
    $fileName = $it.fileName
    $title = $it.title
    $character = $it.character

    if (-not (Test-Path $rawPath)) {
        Write-Warning "Missing raw file: $rawPath"
        continue
    }

    $rawBytes = [System.IO.File]::ReadAllBytes($rawPath)
    $ms = [System.IO.MemoryStream]::new($rawBytes)
    $rawImg = [System.Drawing.Image]::FromStream($ms)

    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # 1. Aspect Fill Image
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
        $srcY = [int](($rawImg.Height - $srcHeight) / 2)
    }

    $destRect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
    $srcRect = [System.Drawing.Rectangle]::new($srcX, $srcY, $srcWidth, $srcHeight)
    $g.DrawImage($rawImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $rawImg.Dispose()
    $ms.Dispose()

    # 2. Top Dark Gradient Vignette (300px)
    $pTop1 = [System.Drawing.PointF]::new(0, 0)
    $pTop2 = [System.Drawing.PointF]::new(0, 300)
    $topGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pTop1, $pTop2, [System.Drawing.Color]::FromArgb(235, 8, 8, 14), [System.Drawing.Color]::FromArgb(0, 8, 8, 14))
    $g.FillRectangle($topGrad, [System.Drawing.Rectangle]::new(0, 0, $w, 300))
    $topGrad.Dispose()

    # 3. Bottom Dark Gradient Vignette (320px)
    $pBot1 = [System.Drawing.PointF]::new(0, ($h - 320))
    $pBot2 = [System.Drawing.PointF]::new(0, $h)
    $botGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pBot1, $pBot2, [System.Drawing.Color]::FromArgb(0, 8, 8, 14), [System.Drawing.Color]::FromArgb(245, 8, 8, 14))
    $g.FillRectangle($botGrad, [System.Drawing.Rectangle]::new(0, ($h - 320), $w, 320))
    $botGrad.Dispose()

    # 4. Top Brand Header
    $brandRect = [System.Drawing.RectangleF]::new(0, 32, $w, 24)
    $g.DrawString("+  K A V A N A   O R I G I N A L  +", $fontBrand, $brushGold, $brandRect, $sf)

    # 5. Title & Subtitle Parsing (strip parenthetical text for clean typography)
    $cleanTitle = ($title -replace '\s*\([^\)]*\)', '').ToUpper().Trim()
    $mainLine = $cleanTitle
    $subLine = ""
    if ($cleanTitle -match "^(.*?):\s*(.*)$") {
        $mainLine = $matches[1]
        $subLine = $matches[2]
    }

    # Main Title
    $titleRectShadow = [System.Drawing.RectangleF]::new(22, 69, ($w - 40), 85)
    $titleRect = [System.Drawing.RectangleF]::new(20, 67, ($w - 40), 85)
    $g.DrawString($mainLine, $fontTitle, $brushShadow, $titleRectShadow, $sf)
    $g.DrawString($mainLine, $fontTitle, $brushWhite, $titleRect, $sf)

    # Subtitle
    if ($subLine) {
        $subRectShadow = [System.Drawing.RectangleF]::new(21, 154, ($w - 40), 38)
        $subRect = [System.Drawing.RectangleF]::new(20, 153, ($w - 40), 38)
        $g.DrawString($subLine, $fontSub, $brushShadow, $subRectShadow, $sf)
        $g.DrawString($subLine, $fontSub, $brushGoldLight, $subRect, $sf)
    }

    # 6. Bottom Character Name & Badge
    $cleanChar = ($character -replace '\s*\([^\)]*\)', '').ToUpper().Trim()
    $charDisplay = "-- " + $cleanChar + " --"
    $charRectShadow = [System.Drawing.RectangleF]::new(21, ($h - 79), ($w - 40), 36)
    $charRect = [System.Drawing.RectangleF]::new(20, ($h - 80), ($w - 40), 36)
    $g.DrawString($charDisplay, $fontChar, $brushShadow, $charRectShadow, $sf)
    $g.DrawString($charDisplay, $fontChar, $brushGoldLight, $charRect, $sf)

    $badgeRect = [System.Drawing.RectangleF]::new(30, ($h - 40), ($w - 60), 24)
    $g.DrawString("18+ UNCENSORED - CINEMATIC ROMANCE NOVEL", $fontBadge, $brushGold, $badgeRect, $sf)

    $g.Dispose()

    # Save to both assets/ and public/assets/
    $outRoot = "assets/$fileName"
    $outPublic = "public/assets/$fileName"
    $bmp.Save($outRoot, $jpegCodec, $encoderParams)
    $bmp.Save($outPublic, $jpegCodec, $encoderParams)
    $bmp.Dispose()

    if ($count % 15 -eq 0 -or $count -eq $items.Count) {
        Write-Host "Rendered [$count/$($items.Count)] $fileName"
    }
}

$fontBrand.Dispose()
$fontTitle.Dispose()
$fontSub.Dispose()
$fontChar.Dispose()
$fontBadge.Dispose()
$brushShadow.Dispose()
$brushWhite.Dispose()
$brushGold.Dispose()
$brushGoldLight.Dispose()
$sf.Dispose()
$encoderParams.Dispose()

Write-Host "ALL $($items.Count) LOVE-VILLA STYLE POSTERS RENDERED SUCCESSFULLY IN BOTH ASSETS/ AND PUBLIC/ASSETS/!"
