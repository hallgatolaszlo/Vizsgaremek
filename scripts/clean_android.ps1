try {
    Get-Process adb,java,javaw,node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {
    Write-Error "Error stopping processes: $_"
}