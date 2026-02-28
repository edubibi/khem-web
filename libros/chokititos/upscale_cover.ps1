
$inputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\PORTADA OK LIBRO.png"
$outputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\PORTADA_SUPREME_300DPI.png"

try {
    Add-Type -AssemblyName System.Drawing
    
    if (-not (Test-Path $inputPath)) {
        Write-Error "File not found: $inputPath"
        exit 1
    }

    $img = [System.Drawing.Image]::FromFile($inputPath)
    Write-Host "Original Width: $($img.Width)"
    Write-Host "Original Height: $($img.Height)"
    
    # Target: We need it to be big enough for print (e.g. 6 inches width @ 300 DPI = 1800px)
    # Let's target a safe width of 2500 pixels to be sure.
    $targetWidth = 2500
    $ratio = $targetWidth / $img.Width
    $targetHeight = [int]($img.Height * $ratio)
    
    Write-Host "Resizing to: $targetWidth x $targetHeight"

    # Create new bitmap with new dimensions
    $newBitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $graph = [System.Drawing.Graphics]::FromImage($newBitmap)
    
    # High quality settings
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw scaled image
    $graph.DrawImage($img, 0, 0, $targetWidth, $targetHeight)
    
    # Force 300 DPI metadata on the new image
    $newBitmap.SetResolution(300, 300)
    
    # Save
    $newBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $img.Dispose()
    $newBitmap.Dispose()
    $graph.Dispose()
    
    Write-Host "Success: Created $outputPath with actual high resolution"
}
catch {
    Write-Error "Error: $_"
    exit 1
}
