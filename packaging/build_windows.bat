@echo off
echo Building AI Student Helpdesk for Windows...
echo Installing PyInstaller if missing...
pip install pyinstaller

echo Cleaning previous builds...
rmdir /s /q build
rmdir /s /q dist

echo Building executable...
pyinstaller --clean --noconfirm packaging\helpdesk.spec

echo Build complete! You can find the output in the dist/AI-Student-Helpdesk folder.
pause
