Add-Type -AssemblyName System.Drawing

$p1 = [System.Drawing.PointF]::new(0, 0)
$p2 = [System.Drawing.PointF]::new(0, 300)
$c1 = [System.Drawing.Color]::FromArgb(240, 10, 10, 16)
$c2 = [System.Drawing.Color]::FromArgb(0, 10, 10, 16)
$grad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($p1, $p2, $c1, $c2)
Write-Host "Gradient brush created with ::new() successfully!"

$font = [System.Drawing.Font]::new("Georgia", [float]32.0, [System.Drawing.FontStyle]::Bold)
Write-Host "Font created with ::new() successfully! Name=$($font.Name), Size=$($font.Size)"

$grad.Dispose()
$font.Dispose()
