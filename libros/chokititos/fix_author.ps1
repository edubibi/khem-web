
$inputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\FOTO_AUTOR_ORIGINAL.jpg"
$outputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\FOTO_AUTOR_AMAZON.jpg"

try {
    Add-Type -AssemblyName System.Drawing
    
    if (-not (Test-Path $inputPath)) {
        Write-Error "File not found: $inputPath"
        exit 1
    }

    $img = [System.Drawing.Image]::FromFile($inputPath)
    
    # Author photo: 1000px is good.
    $targetWidth = 1000
    
    if ($img.Width -lt $targetWidth) {
        $ratio = $targetWidth / $img.Width
        $targetHeight = [int]($img.Height * $ratio)
        
        $newBitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $graph = [System.Drawing.Graphics]::FromImage($newBitmap)
        
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $graph.DrawImage($img, 0, 0, $targetWidth, $targetHeight)
        $finalImg = $newBitmap
    } else {
        $finalImg = New-Object System.Drawing.Bitmap($img)
        $graph = $null 
    }
    
    # Force 300 DPI
    $finalImg.SetResolution(300, 300)
    
    # Save
    $finalImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    # Cleanup
    $img.Dispose()
    if ($finalImg -ne $null) { $finalImg.Dispose() }
    if ($graph -ne $null) { $graph.Dispose() }
    
    Write-Host "Success: Created $outputPath"
} catch {
    Write-Error "Error: $_"
    exit 1
}
