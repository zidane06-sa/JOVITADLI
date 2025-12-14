@echo off
REM Script untuk testing servo API dari command line

echo Testing Servo API...
echo.

echo 1. Testing BESI...
curl -X POST http://localhost:5000/api/servo/move ^
  -H "Content-Type: application/json" ^
  -d "{\"bin\": \"BESI\"}"

echo.
echo.
echo 2. Testing KARDUS...
curl -X POST http://localhost:5000/api/servo/move ^
  -H "Content-Type: application/json" ^
  -d "{\"bin\": \"KARDUS\"}"

echo.
echo.
echo 3. Testing KERTAS...
curl -X POST http://localhost:5000/api/servo/move ^
  -H "Content-Type: application/json" ^
  -d "{\"bin\": \"KERTAS\"}"

echo.
echo.
echo 4. Testing PLASTIK...
curl -X POST http://localhost:5000/api/servo/move ^
  -H "Content-Type: application/json" ^
  -d "{\"bin\": \"PLASTIK\"}"

pause
