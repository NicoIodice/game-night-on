@echo off
rem Starts game-night-on locally and opens it in the browser.
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm was not found. Install it with: winget install OpenJS.NodeJS.LTS
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing packages...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting game night at http://localhost:5173/game-night-on/
echo Close this window or press Ctrl+C to stop.
call npm run dev -- --open
pause
