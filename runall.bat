@echo off
REM Cambiar a la carpeta frontend y ejecutar npm run dev en una nueva ventana
echo Iniciando servidor de desarrollo en frontend...
cd frontend
start cmd /k "npm run dev"
cd ..

REM Cambiar a la carpeta backend y ejecutar npm run dev en una nueva ventana
echo Iniciando servidor de desarrollo en backend...
cd backend
start cmd /k "npm run dev"
cd ..

echo Todos los servicios han sido iniciados.
pause
