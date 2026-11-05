@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale Node.js 24 conforme o README.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo As dependencias do projeto nao estao instaladas.
  echo Na pasta do projeto, execute: pnpm install --frozen-lockfile
  pause
  exit /b 1
)
echo Abrindo o editor de receitas no navegador...
echo Se o navegador nao abrir, acrescente tools/catalog-editor/ ao endereco Local mostrado abaixo.
node "node_modules\vite\bin\vite.js" --host 127.0.0.1 --open /tools/catalog-editor/
pause
