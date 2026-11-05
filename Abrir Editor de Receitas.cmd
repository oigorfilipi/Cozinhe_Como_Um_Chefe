@echo off
cd /d "%~dp0"
where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm nao foi encontrado. Instale Node.js e pnpm conforme o README.
  pause
  exit /b 1
)
call pnpm editor
pause
