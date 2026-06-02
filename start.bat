@echo off
title SBStudy - Lancement de l'application
color 0A

echo ========================================
echo      SBStudy - Lancement automatique
echo ========================================
echo.

echo [1/2] Demarrage du backend (port 3001)...
start "SBStudy Backend" cmd /k "cd backend && node server.js"

echo Attente du backend...
timeout /t 3 /nobreak > nul

echo [2/2] Demarrage du frontend (port 5173)...
start "SBStudy Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Application lancee !
echo ========================================
echo    Backend  : http://localhost:3001
echo    Frontend : http://localhost:5173
echo ========================================
echo.

pause