@echo off
setlocal
cd /d "%~dp0"
if not exist "Editor de Receitas.html" (
  echo O arquivo Editor de Receitas.html nao foi encontrado nesta pasta.
  pause
  exit /b 1
)
start "" "%~dp0Editor de Receitas.html"
if errorlevel 1 (
  echo Nao foi possivel abrir o editor automaticamente.
  echo Abra Editor de Receitas.html com dois cliques pelo Explorador de Arquivos.
  pause
  exit /b 1
)
