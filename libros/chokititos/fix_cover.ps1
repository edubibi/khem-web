
$inputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\PORTADA OK LIBRO.png"
$outputPath = "c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\PORTADA_AMAZON_300DPI.png"

try {
    Add-Type -AssemblyName System.Drawing
    
    if (-not (Test-Path $inputPath)) {
        Write-Error "File not found: $inputPath"
        exit 1
    }

    $img = [System.Drawing.Image]::FromFile($inputPath)
    
    # Create a new bitmap with the same dimensions
    $bitmap = New-Object System.Drawing.Bitmap($img)
    
    # Force 300 DPI
    $bitmap.SetResolution(300, 300)
    
    # Save
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $img.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Success: Created $outputPath with 300 DPI"
}
catch {
    Write-Error "Error: $_"
    exit 1
}
