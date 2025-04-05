@echo off
title Servidor de Desarrollo ESCR-Licenciamiento

echo Iniciando servicios de XAMPP...
echo.

:: Inicia los servicios de Apache y MySQL de XAMPP
start /b "" "C:\xampp\apache_start.bat"
timeout /t 2 /nobreak > nul
start /b "" "C:\xampp\mysql_start.bat"

:: Espera 5 segundos para asegurar que los servicios estén activos
timeout /t 5 /nobreak > nul

echo Iniciando servidores de desarrollo...
echo.

:: Inicia PHP Artisan Serve en una nueva ventana
start cmd /k "echo Servidor PHP Artisan && php artisan serve"

:: Espera 2 segundos
timeout /t 2 /nobreak > nul

:: Inicia NPM Run Dev en una nueva ventana
start cmd /k "echo Servidor NPM && npm run dev"

echo Servidores iniciados correctamente!
echo.
echo Para detener los servidores, cierra las ventanas de comando o presiona Ctrl+C en cada una.
echo Para detener los servicios de XAMPP, usa el Panel de Control de XAMPP.
echo.
pause