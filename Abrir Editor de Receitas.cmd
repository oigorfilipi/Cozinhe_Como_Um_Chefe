@echo off
setlocal
cd /d "%~dp0"
set "NODE_EXE="
where node.exe >nul 2>nul
if not errorlevel 1 set "NODE_EXE=node.exe"
if not defined NODE_EXE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined NODE_EXE (
  echo Node.js nao foi encontrado, inclusive na instalacao do Codex.
  echo Instale Node.js 24 para abrir este editor.
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
"%NODE_EXE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --open /tools/catalog-editor/
pause
