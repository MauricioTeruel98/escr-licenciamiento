@echo off
title Servidor de Desarrollo ESCR-Licenciamiento

echo Iniciando servicios de XAMPP...
echo.

:: Inicia los servicios de Apache y MySQL de XAMPP
start /b "" "C:\xampp\apache_start.bat"
timeout /t 2 /nobreak > nul
start /b "" "C:\xampp\mysql_start.bat"

:: Abre el ejecutable xampp-control.exe
start "" "C:\xampp\xampp-control.exe"

:: Espera 5 segundos para asegurar que los servicios estén activos
timeout /t 5 /nobreak > nul

echo Iniciando servidores de desarrollo...
echo.

:: Inicia PHP Artisan Serve en una nueva ventana
start cmd /k "echo Servidor PHP Artisan && php artisan serve"

:: Espera 3 segundos para asegurar que el servidor PHP esté activo
timeout /t 3 /nobreak > nul

:: Abre la URL en el navegador predeterminado
start http://127.0.0.1:8000/

:: Inicia NPM Run Dev en una nueva ventana
start cmd /k "echo Servidor NPM && npm run dev"

echo Servidores iniciados correctamente!
echo.
echo Para detener los servidores, cierra las ventanas de comando o presiona Ctrl+C en cada una.
echo Para detener los servicios de XAMPP, usa el Panel de Control de XAMPP.
echo.
pause