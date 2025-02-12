@echo off
REM Cambiar a la carpeta raíz del proyecto
cd /d "%~dp0"

echo Instalando dependencias en la carpeta raíz...
call npm install

REM Cambiar a la carpeta frontend
echo Instalando dependencias en la carpeta frontend...
cd frontend
call npm install

REM Volver a la carpeta raíz
cd ..

REM Cambiar a la carpeta backend
echo Instalando dependencias en la carpeta backend...
cd backend
call npm install

echo Instalación de dependencias completada.
pause
