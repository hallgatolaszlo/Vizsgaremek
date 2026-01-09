try {
    Get-ChildItem -Recurse -Filter node_modules -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Get-ChildItem -Recurse -Filter .turbo -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path pnpm-lock.yaml) { 
        Remove-Item pnpm-lock.yaml -Force -ErrorAction SilentlyContinue
    }
} catch {
    Write-Error "Error cleaning packages: $_"
}