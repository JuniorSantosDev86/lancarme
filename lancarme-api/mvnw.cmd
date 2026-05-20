@echo off
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  mvn %*
  exit /B %ERRORLEVEL%
)

echo Maven is not installed and maven-wrapper.jar is not present. 1>&2
exit /B 127
