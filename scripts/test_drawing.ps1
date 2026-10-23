Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 100, 100
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Black)
$g.Dispose()
$bmp.Dispose()
Write-Host "System.Drawing is available and working!"
