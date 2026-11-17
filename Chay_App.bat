@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sổ Thu Chi Thông Minh v1.7.5
color 0A

echo =====================================================================
echo           SỔ THU CHI THÔNG MINH - SMARTFINANCE PRO v1.7.5
echo             Phát triển bởi Sếp Lam ^& Trợ lý AI SORA
echo =====================================================================
echo.
echo [*] Dang kiem tra va giai phong port 5188 neu dang bi chiem...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "127.0.0.1:5188" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Dang khoi dong may chu noi bo Offline-First...
start /b python server.py

timeout /t 1 /nobreak >nul

echo.
echo =====================================================================
echo  [+] Ung dung dang chay tai: http://127.0.0.1:5188
echo  [+] San sang nhan dien giong noi Tieng Viet ^& PWA Offline
echo =====================================================================
echo.

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://127.0.0.1:5188"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:5188"
) else (
    start "" "http://127.0.0.1:5188"
)

echo [i] Dong cua so nay de tat may chu So Thu Chi.
echo.
pause
