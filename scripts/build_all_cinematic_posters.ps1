Add-Type -AssemblyName System.Drawing

function Render-CinematicPoster {
    param(
        [string]$fileName,
        [string]$title,
        [string]$character,
        [string]$tagline = "A DARK ROMANCE VISUAL NOVEL"
    )

    $inPath = "assets/$fileName"
    if (-not (Test-Path $inPath)) {
        Write-Warning "File not found: $inPath"
        return
    }

    $rawBytes = [System.IO.File]::ReadAllBytes($inPath)
    $ms = [System.IO.MemoryStream]::new($rawBytes)
    $rawImg = [System.Drawing.Image]::FromStream($ms)

    $w = 800
    $h = 1200

    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # 1. Aspect-fill image onto 800x1200 canvas
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

    # 2. Top Dark Gradient (320px)
    $pTop1 = [System.Drawing.PointF]::new(0, 0)
    $pTop2 = [System.Drawing.PointF]::new(0, 320)
    $cTop1 = [System.Drawing.Color]::FromArgb(235, 8, 8, 14)
    $cTop2 = [System.Drawing.Color]::FromArgb(0, 8, 8, 14)
    $topGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pTop1, $pTop2, $cTop1, $cTop2)
    $g.FillRectangle($topGrad, [System.Drawing.Rectangle]::new(0, 0, $w, 320))
    $topGrad.Dispose()

    # 3. Bottom Dark Gradient (340px)
    $pBot1 = [System.Drawing.PointF]::new(0, ($h - 340))
    $pBot2 = [System.Drawing.PointF]::new(0, $h)
    $cBot1 = [System.Drawing.Color]::FromArgb(0, 8, 8, 14)
    $cBot2 = [System.Drawing.Color]::FromArgb(245, 8, 8, 14)
    $botGrad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pBot1, $pBot2, $cBot1, $cBot2)
    $g.FillRectangle($botGrad, [System.Drawing.Rectangle]::new(0, ($h - 340), $w, 340))
    $botGrad.Dispose()

    # 4. Fonts and Brushes
    $fontTitle = [System.Drawing.Font]::new("Georgia", [float]30.0, [System.Drawing.FontStyle]::Bold)
    $fontSub = [System.Drawing.Font]::new("Palatino Linotype", [float]18.0, [System.Drawing.FontStyle]::Bold)
    $fontTag = [System.Drawing.Font]::new("Arial", [float]11.0, [System.Drawing.FontStyle]::Bold)
    $fontChar = [System.Drawing.Font]::new("Georgia", [float]19.0, [System.Drawing.FontStyle]::Bold)

    $brushShadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(230, 0, 0, 0))
    $brushWhite = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $brushGold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 225, 178, 80))
    $brushGoldLight = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 245, 225, 160))

    $sf = [System.Drawing.StringFormat]::new()
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # 5. Top Brand Tag
    $brandRect = [System.Drawing.RectangleF]::new(0, 32, $w, 24)
    $g.DrawString("+  K A V A N A   O R I G I N A L  +", $fontTag, $brushGold, $brandRect, $sf)

    # 6. Parse and draw Title (splitting by colon if present)
    $cleanTitle = $title.ToUpper()
    $mainLine = $cleanTitle
    $subLine = ""
    if ($cleanTitle -match "^(.*?):\s*(.*)$") {
        $mainLine = $matches[1]
        $subLine = $matches[2]
    }

    # Main Title with drop shadow
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

    # 7. Bottom Character & Genre
    $charDisplay = if ($character) { "-- " + $character.ToUpper() + " --" } else { "-- " + $tagline + " --" }
    $charRectShadow = [System.Drawing.RectangleF]::new(21, ($h - 79), ($w - 40), 36)
    $charRect = [System.Drawing.RectangleF]::new(20, ($h - 80), ($w - 40), 36)
    $g.DrawString($charDisplay, $fontChar, $brushShadow, $charRectShadow, $sf)
    $g.DrawString($charDisplay, $fontChar, $brushGoldLight, $charRect, $sf)

    $badgeRect = [System.Drawing.RectangleF]::new(30, ($h - 40), ($w - 60), 24)
    $g.DrawString("18+ UNCENSORED - CINEMATIC INTERACTIVE STORY", $fontTag, $brushGold, $badgeRect, $sf)

    # Clean resources
    $fontTitle.Dispose()
    $fontSub.Dispose()
    $fontTag.Dispose()
    $fontChar.Dispose()
    $brushShadow.Dispose()
    $brushWhite.Dispose()
    $brushGold.Dispose()
    $brushGoldLight.Dispose()
    $sf.Dispose()
    $g.Dispose()

    # Save to both assets/ and public/assets/
    $encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]93)
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

    $outRoot = "assets/$fileName"
    $outPublic = "public/assets/$fileName"

    $bmp.Save($outRoot, $jpegCodec, $encoderParams)
    $bmp.Save($outPublic, $jpegCodec, $encoderParams)

    $bmp.Dispose()
    $encoderParams.Dispose()

    Write-Host "Done: $fileName"
}

$storyList = @(
    @{ fileName = "poster_professor_elena.jpg"; title = "Forbidden Chemistry: Professor Elena"; character = "Elena Vance" },
    @{ fileName = "poster_badboy_zayd.jpg"; title = "Fast & Dangerous: The Street Racer"; character = "Zayd Khan" },
    @{ fileName = "poster_ex_aarav.jpg"; title = "The Wedding Crash: Your Possessive Ex"; character = "Aarav Mehra" },
    @{ fileName = "poster_neighbor_priya.jpg"; title = "Late Night Doorbell: Seductive Neighbor"; character = "Priya Sharma" },
    @{ fileName = "poster_thakur_veer.jpg"; title = "The Feudal Lord: Thakur Veer"; character = "Thakur Veer Pratap" },
    @{ fileName = "poster_feudal_murtaza.jpg"; title = "Haveli of Secrets: Nawab Murtaza"; character = "Nawab Murtaza Khan" },
    @{ fileName = "poster_rebound_samrat.jpg"; title = "Rebound Passion: The Rival Tycoon"; character = "Samrat Singhal" },
    @{ fileName = "poster_prince_lucian.jpg"; title = "Dark Prince of Shadows: Lord Lucian"; character = "Lucian Nightshade" },
    @{ fileName = "poster_demon_nyx.jpg"; title = "Underworld Empress: Lady Nyx"; character = "Nyx Valerius" },
    @{ fileName = "poster_yandere_ayumi.jpg"; title = "Obsessive Love: Ayumi's Dark Devotion"; character = "Ayumi Yoshida" },
    @{ fileName = "poster_valeria.jpg"; title = "Shadows & Silk: The Dark Temptress"; character = "Valeria Vane" },
    @{ fileName = "poster_gym_rohan.jpg"; title = "After Hours Workout: The Private Trainer"; character = "Rohan Mehra" },
    @{ fileName = "poster_flight_zoya.jpg"; title = "Turbulence & Tension: Flight Attendant"; character = "Zoya Siddiqui" },
    @{ fileName = "poster_doctor_sameer.jpg"; title = "Night Shift Cardiology: Dr. Sameer"; character = "Dr. Sameer Kapoor" },
    @{ fileName = "poster_bestfriend_karan.jpg"; title = "Childhood Pact: The Best Friend"; character = "Karan Oberoi" },
    @{ fileName = "poster_punjab_simran.jpg"; title = "Punjab Heartland: The Fiery Heiress"; character = "Simran Dhillon" },
    @{ fileName = "poster_contract_bride.jpg"; title = "The Contract Bride: Resignation Denied"; character = "Reyansh Malhotra" },
    @{ fileName = "poster_goa_dj.jpg"; title = "Goa Afterhours: The VIP Cabana"; character = "Alia Roy" },
    @{ fileName = "poster_bodyguard_aditya.jpg"; title = "Strict Protocol: Captain Aditya"; character = "Captain Aditya Mehra" },
    @{ fileName = "poster_prof_dev.jpg"; title = "After Class: The Professor's Secret"; character = "Professor Dev Kashyap" },
    @{ fileName = "poster_royal_veer.jpg"; title = "Royal Blood: Midnight in Jaipur"; character = "Yuvraj Veer Pratap Singh" },
    @{ fileName = "poster_mma_arjun.jpg"; title = "Cage & Clinch: The MMA Champion"; character = "Arjun Vardhan" },
    @{ fileName = "poster_french_camille.jpg"; title = "Monaco Sunset: French Riviera Heiress"; character = "Camille Laurent" },
    @{ fileName = "poster_mafia_zara.jpg"; title = "Dubai Vice: The Syndicate Queen"; character = "Zara Sheikh" },
    @{ fileName = "poster_lawyer_tara.jpg"; title = "Overnight Deposition: Rival Law Partner"; character = "Advocate Tara Singhal" },
    @{ fileName = "poster_tattoo_zayn.jpg"; title = "Ink & Skin: The Midnight Tattoo Artist"; character = "Zayn Malik" }
)

Write-Host "Rendering $($storyList.Count) cinematic posters..."
foreach ($s in $storyList) {
    Render-CinematicPoster -fileName $s.fileName -title $s.title -character $s.character
}

Write-Host "ALL POSTERS RENDERED SUCCESSFULLY IN BOTH ASSETS/ AND PUBLIC/ASSETS/!"
