@echo off
REM Runs the widget with this window open so you can see any errors.
cd /d "%~dp0"
echo Folder: %cd%
echo.
echo Python commands found:
where py pyw python pythonw 2>nul
echo.

where py >nul 2>nul
if %errorlevel%==0 (
    py --version
    py whistler_widget.py
) else (
    python --version
    python whistler_widget.py
)

echo.
echo ----------------------------------------------------------
echo The widget has closed. If you see an error above, copy it
echo and paste it to Claude.
pause
