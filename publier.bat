@echo off
REM ============================================================
REM  Publier le site sur GitHub (commit + push) en un double-clic.
REM  A placer a la racine du dossier grand-oral-foot.
REM  Usage : double-clic, ou   publier.bat "Mon message"
REM ============================================================
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"

REM --- Trouver git (Git for Windows, sinon celui de GitHub Desktop) ---
set "GIT=git"
where git >nul 2>nul
if errorlevel 1 (
  set "GIT="
  for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
    if exist "%%D\resources\app\git\cmd\git.exe" set "GIT=%%D\resources\app\git\cmd\git.exe"
  )
)
if "%GIT%"=="" (
  echo.
  echo  Git est introuvable sur ce PC.
  echo  Installe Git for Windows : https://git-scm.com/download/win
  echo  ^(options par defaut^), puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

if not exist ".git" (
  echo.
  echo  Ce dossier n'est pas un depot Git.
  echo  Place publier.bat dans le dossier grand-oral-foot ajoute a GitHub Desktop.
  echo.
  pause
  exit /b 1
)

REM --- Message de commit ---
set "MSG=%~1"
if "%MSG%"=="" (
  set /p "MSG=Decris ta modification (Entree = message automatique) : "
)
if "%MSG%"=="" set "MSG=Mise a jour du %date% %time:~0,5%"

echo.
echo  [1/3] Ajout des fichiers modifies...
"%GIT%" add -A
"%GIT%" diff --cached --quiet
if not errorlevel 1 (
  echo  Rien de nouveau a publier.
  echo.
  pause
  exit /b 0
)

echo  [2/3] Enregistrement : "%MSG%"
"%GIT%" commit -m "%MSG%" >nul
if errorlevel 1 (
  echo  Le commit a echoue. Ouvre GitHub Desktop pour voir le detail.
  pause
  exit /b 1
)

echo  [3/3] Envoi vers GitHub...
"%GIT%" push origin HEAD
if errorlevel 1 (
  echo.
  echo  L'envoi a echoue. Le commit est fait : ouvre GitHub Desktop
  echo  et clique sur "Push origin" pour terminer.
  echo.
  pause
  exit /b 1
)

echo.
echo  C'est en ligne ! Le site se met a jour d'ici 1 a 2 minutes :
echo  https://robertinho-devfront.github.io/grand-oral-foot/
echo.
pause
