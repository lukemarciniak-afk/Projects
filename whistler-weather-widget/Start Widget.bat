@echo off
REM Starts the widget without leaving a black console window open.
cd /d "%~dp0"

if not exist "whistler_widget.py" (
    echo Can't find whistler_widget.py next to this file.
    echo.
    echo If you opened this from inside the downloaded ZIP, right-click the
    echo ZIP file, choose "Extract All", then run the extracted copy.
    pause
    exit /b
)

where pyw >nul 2>nul
if %errorlevel%==0 (
    start "" pyw whistler_widget.py
    exit /b
)
where pythonw >nul 2>nul
if %errorlevel%==0 (
    start "" pythonw whistler_widget.py
    exit /b
)

echo Can't find Python on this computer.
echo Try "Debug Widget.bat" for more details.
pause
