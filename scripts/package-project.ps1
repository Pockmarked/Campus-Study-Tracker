# ==============================================================================
# Script Otomasi Pembuatan ZIP Project untuk Mochammad Nadhif Athallah
# ==============================================================================

$ProjectDir = Split-Path -Parent $PSScriptRoot
$ZipFile = Join-Path $ProjectDir "campus-study-tracker-102062400144.zip"

Write-Host "Mengemas project dari: $ProjectDir" -ForegroundColor Cyan
Write-Host "Tujuan ZIP: $ZipFile" -ForegroundColor Cyan

if (Test-Path $ZipFile) {
    Remove-Item -Force $ZipFile
}

$ExcludePatterns = @(
    "\\node_modules($|\\)",
    "\\\.git($|\\)",
    "campus-study-tracker.*\.zip$"
)

# Buat folder sementara untuk clean staging
$TempDir = Join-Path $env:TEMP ("campus_study_pkg_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

try {
    $Items = Get-ChildItem -Path $ProjectDir -Recurse | Where-Object {
        $itemPath = $_.FullName
        $exclude = $false
        foreach ($pat in $ExcludePatterns) {
            if ($itemPath -match $pat) {
                $exclude = $true
                break
            }
        }
        -not $exclude
    }

    foreach ($item in $Items) {
        $relPath = $item.FullName.Substring($ProjectDir.Length + 1)
        $targetPath = Join-Path $TempDir $relPath
        if ($item.PSIsContainer) {
            if (-not (Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
            }
        } else {
            $parent = Split-Path -Parent $targetPath
            if (-not (Test-Path $parent)) {
                New-Item -ItemType Directory -Path $parent -Force | Out-Null
            }
            Copy-Item -Path $item.FullName -Destination $targetPath -Force
        }
    }

    # Compress staging directory
    Compress-Archive -Path (Join-Path $TempDir "*") -DestinationPath $ZipFile -Force

    $zipItem = Get-Item $ZipFile
    Write-Host "Paket ZIP berhasil dibuat!" -ForegroundColor Green
    Write-Host "File : $($zipItem.FullName)" -ForegroundColor Yellow
    Write-Host "Ukuran : $([math]::Round($zipItem.Length / 1KB, 2)) KB" -ForegroundColor Yellow
}
finally {
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
