Write-Host "Starting backend and generating types..."
docker compose up --build db backend typegen --wait

if ($LASTEXITCODE -ne 0) {
    Write-Host "Type generation failed!"
    exit 1
}

Write-Host "Types generated! Building and starting web..." 

docker compose up --build web -d

Write-Host "All services running!"
docker compose ps