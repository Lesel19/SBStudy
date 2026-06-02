# start.ps1
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     SBStudy - Lancement automatique" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Demarrage du backend (port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node server.js"

Start-Sleep -Seconds 3

Write-Host "[2/2] Demarrage du frontend (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Application lancee !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Backend  : http://localhost:3001" -ForegroundColor Yellow
Write-Host "   Frontend : http://localhost:5173" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan