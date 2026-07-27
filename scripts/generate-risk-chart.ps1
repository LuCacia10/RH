param(
    [string]$OutputPath = (Join-Path $PSScriptRoot "..\src\assets\images\analyse-risques-sgrh.png")
)

Add-Type -AssemblyName System.Drawing

$width = 1600
$height = 900
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$bitmap.SetResolution(160, 160)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::White)

function New-Font([string]$family, [float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
    New-Object System.Drawing.Font($family, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-CenteredText([string]$text, [System.Drawing.Font]$font, [System.Drawing.Brush]$brush, [float]$x, [float]$y) {
    $size = $graphics.MeasureString($text, $font)
    $graphics.DrawString($text, $font, $brush, $x - ($size.Width / 2), $y - ($size.Height / 2))
}

$ink = [System.Drawing.Color]::FromArgb(24, 32, 43)
$gridColor = [System.Drawing.Color]::FromArgb(211, 217, 224)
$red = [System.Drawing.Color]::FromArgb(255, 55, 55)
$orange = [System.Drawing.Color]::FromArgb(255, 151, 48)
$yellow = [System.Drawing.Color]::FromArgb(255, 225, 48)
$green = [System.Drawing.Color]::FromArgb(53, 226, 78)

# Build accented French strings from Unicode code points so the script remains
# compatible with Windows PowerShell installations that read UTF-8 as ANSI.
$lowerEAcute = [char]0x00E9
$upperEAcute = [char]0x00C9
$labelLegend = "L" + $lowerEAcute + "gende :"
$labelHigh = [string]$upperEAcute + "lev" + $lowerEAcute
$labelModerate = "Mod" + $lowerEAcute + "r" + $lowerEAcute
$labelProbability = "Probabilit" + $lowerEAcute

$inkBrush = New-Object System.Drawing.SolidBrush($ink)
$whiteBrush = [System.Drawing.Brushes]::White
$gridPen = New-Object System.Drawing.Pen($gridColor, 2)
$axisPen = New-Object System.Drawing.Pen($ink, 3)
$axisPen.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor

$axisFont = New-Font "Georgia" 27 ([System.Drawing.FontStyle]::Bold)
$tickFont = New-Font "Georgia" 22
$bubbleFont = New-Font "Arial" 23 ([System.Drawing.FontStyle]::Bold)
$legendTitleFont = New-Font "Georgia" 25 ([System.Drawing.FontStyle]::Bold)
$legendFont = New-Font "Georgia" 22

$left = 160
$top = 110
$right = 960
$bottom = 785
$stepX = ($right - $left) / 4
$stepY = ($bottom - $top) / 4

# Grid and ticks
for ($i = 0; $i -lt 5; $i++) {
    $x = $left + ($i * $stepX)
    $y = $bottom - ($i * $stepY)
    $graphics.DrawLine($gridPen, $x, $top, $x, $bottom)
    $graphics.DrawLine($gridPen, $left, $y, $right, $y)
    Draw-CenteredText ([string]($i + 1)) $tickFont $inkBrush $x ($bottom + 34)
    Draw-CenteredText ([string]($i + 1)) $tickFont $inkBrush ($left - 34) $y
}

# Axes with arrowheads
$graphics.DrawLine($axisPen, $left, $bottom, $right + 48, $bottom)
$graphics.DrawLine($axisPen, $left, $bottom, $left, $top - 48)
$graphics.DrawString($labelProbability, $axisFont, $inkBrush, $right + 60, $bottom - 21)
$graphics.DrawString("Impact", $axisFont, $inkBrush, $left - 48, $top - 92)

function Draw-Risk([string]$code, [int]$probability, [int]$impact, [System.Drawing.Color]$color) {
    $cx = $left + (($probability - 1) * $stepX)
    $cy = $bottom - (($impact - 1) * $stepY)
    $diameter = 82
    $brush = New-Object System.Drawing.SolidBrush($color)
    $border = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 4)
    $graphics.FillEllipse($brush, $cx - ($diameter / 2), $cy - ($diameter / 2), $diameter, $diameter)
    $graphics.DrawEllipse($border, $cx - ($diameter / 2), $cy - ($diameter / 2), $diameter, $diameter)
    Draw-CenteredText $code $bubbleFont $inkBrush $cx $cy
    $brush.Dispose()
    $border.Dispose()
}

# Cotation : R1 connexion, R2 sécurité, R3 résistance, R4 erreurs de saisie
Draw-Risk "R1" 4 4 $red
Draw-Risk "R2" 3 5 $red
Draw-Risk "R3" 4 3 $orange
Draw-Risk "R4" 3 4 $orange

# Severity legend
$legendX = 1060
$graphics.DrawString($labelLegend, $legendTitleFont, $inkBrush, $legendX, 170)
$legendItems = @(
    @{ Label = "Critique"; Color = $red },
    @{ Label = $labelHigh; Color = $orange },
    @{ Label = $labelModerate; Color = $yellow },
    @{ Label = "Faible"; Color = $green }
)

$itemX = $legendX
$itemY = 225
foreach ($item in $legendItems) {
    $brush = New-Object System.Drawing.SolidBrush($item.Color)
    $graphics.FillEllipse($brush, $itemX, $itemY, 28, 28)
    $graphics.DrawString($item.Label, $legendFont, $inkBrush, $itemX + 38, $itemY - 2)
    $itemY += 52
    $brush.Dispose()
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$axisFont.Dispose()
$tickFont.Dispose()
$bubbleFont.Dispose()
$legendTitleFont.Dispose()
$legendFont.Dispose()
$inkBrush.Dispose()
$gridPen.Dispose()
$axisPen.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $OutputPath
