Add-Type -AssemblyName System.Drawing

function Create-CinematicPoster {
    param(
        [string]$inputPath,
        [string]$outputPath,
        [string]$title,
        [string]$subtitle,
        [string]$category
    )

    if (-not (Test-Path $inputPath)) {
        Write-Warning "File not found: $inputPath"
        return
    }

    $rawImg = [System.Drawing.Image]::FromFile($inputPath)
    $targetWidth = 800
    $targetHeight = 1200

    $bmp = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # 1. Scale and center-crop to fill 800x1200
    $imgAspect = $rawImg.Width / $rawImg.Height
    $targetAspect = $targetWidth / $targetHeight

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

    $destRect = New-Object System.Drawing.Rectangle 0, 0, $targetWidth, $targetHeight
    $srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $srcWidth, $srcHeight
    $g.DrawImage($rawImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $rawImg.Dispose()

    # 2. Top Dark Gradient Vignette for Title
    $topRect = New-Object System.Drawing.Rectangle 0, 0, $targetWidth, 320
    $topGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $topRect, `
        ([System.Drawing.Color]::FromArgb(235, 10, 10, 16)), `
        ([System.Drawing.Color]::FromArgb(0, 10, 10, 16)), `
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    $g.FillRectangle($topGrad, $topRect)
    $topGrad.Dispose()

    # 3. Bottom Dark Gradient Vignette
    $botRect = New-Object System.Drawing.Rectangle 0, ($targetHeight - 320), $targetWidth, 320
    $botGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $botRect, `
        ([System.Drawing.Color]::FromArgb(0, 10, 10, 16)), `
        ([System.Drawing.Color]::FromArgb(240, 10, 10, 16)), `
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    $g.FillRectangle($botGrad, $botRect)
    $botGrad.Dispose()

    # 4. Cinema Title at Top
    $cleanTitle = $title.ToUpper()
    $mainTitle = $cleanTitle
    $subTitleText = ""
    if ($cleanTitle -match "^(.*?):\s*(.*)$") {
        $mainTitle = $matches[1]
        $subTitleText = $matches[2]
    }

    $titleFontFamily = "Georgia"
    $titleFont = New-Object System.Drawing.Font $titleFontFamily, 32, [System.Drawing.FontStyle]::Bold
    $subFont = New-Object System.Drawing.Font "Palatino Linotype", 17, [System.Drawing.FontStyle]::Bold
    $tagFont = New-Object System.Drawing.Font "Arial", 11, [System.Drawing.FontStyle]::Bold

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Top Brand Tag
    $goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 225, 175, 75))
    $brandRect = New-Object System.Drawing.RectangleF 0, 30, $targetWidth, 25
    $g.DrawString("* KAVANA ORIGINAL NOVEL *", $tagFont, $goldBrush, $brandRect, $sf)

    # Main Title with drop shadow
    $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 0, 0, 0))
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))

    $titleRect = New-Object System.Drawing.RectangleF 20, 65, ($targetWidth - 40), 90
    $titleRectShadow = New-Object System.Drawing.RectangleF 22, 67, ($targetWidth - 40), 90
    $g.DrawString($mainTitle, $titleFont, $shadowBrush, $titleRectShadow, $sf)
    $g.DrawString($mainTitle, $titleFont, $whiteBrush, $titleRect, $sf)

    # Subtitle if present
    if ($subTitleText) {
        $subRect = New-Object System.Drawing.RectangleF 20, 155, ($targetWidth - 40), 38
        $subRectShadow = New-Object System.Drawing.RectangleF 21, 156, ($targetWidth - 40), 38
        $goldLightBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 240, 210, 140))
        $g.DrawString($subTitleText, $subFont, $shadowBrush, $subRectShadow, $sf)
        $g.DrawString($subTitleText, $subFont, $goldLightBrush, $subRect, $sf)
        $goldLightBrush.Dispose()
    }

    # Bottom Tagline
    $charText = if ($subtitle) { "- " + $subtitle.ToUpper() + " -" } else { "- A DARK ROMANCE NOVEL -" }
    $botTagRect = New-Object System.Drawing.RectangleF 20, ($targetHeight - 70), ($targetWidth - 40), 35
    $g.DrawString($charText, $subFont, $whiteBrush, $botTagRect, $sf)

    $badgeRect = New-Object System.Drawing.RectangleF 30, ($targetHeight - 38), ($targetWidth - 60), 25
    $g.DrawString("18+ UNCENSORED - CINEMATIC INTERACTIVE STORY", $tagFont, $goldBrush, $badgeRect, $sf)

    # Cleanup
    $titleFont.Dispose()
    $subFont.Dispose()
    $tagFont.Dispose()
    $sf.Dispose()
    $goldBrush.Dispose()
    $shadowBrush.Dispose()
    $whiteBrush.Dispose()
    $g.Dispose()

    # Save as high-quality JPEG
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    $bmp.Save($outputPath, $jpegCodec, $encoderParams)
    $bmp.Dispose()
    $encoderParams.Dispose()
    Write-Host "Created cinematic poster: $outputPath"
}

# Test on poster_professor_elena.jpg
Create-CinematicPoster -inputPath "assets/poster_professor_elena.jpg" `
                      -outputPath "assets/poster_professor_elena.jpg" `
                      -title "Forbidden Chemistry: Professor Elena" `
                      -subtitle "Elena Vance" `
                      -category "Forbidden Desires"
