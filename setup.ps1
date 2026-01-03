# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill processes on ports 5000 and 5001
Write-Host "Checking for processes on ports 5000 and 5001..."
$ports = @(5000, 5001)

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) {
        Write-Host "Killing process on port $port..."
        Stop-Process -Id $process -Force
    }
}

# Change to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Update backend port in server.js
$backendPath = "$projectRoot\src\api\sampleBackend\server.js"
if (Test-Path $backendPath) {
    Write-Host "Updating backend port to 5001..."
    (Get-Content $backendPath) -replace 'const PORT = process.env.PORT || 5000;', 'const PORT = process.env.PORT || 5001;' | Set-Content $backendPath
}

# Update frontend API URL
$frontendApiPath = "$projectRoot\src\api\pyq.ts"
if (Test-Path $frontendApiPath) {
    Write-Host "Updating frontend API URL..."
    (Get-Content $frontendApiPath) -replace 'http://localhost:5000/api', 'http://localhost:5001/api' | Set-Content $frontendApiPath
}

# Function to start a process in a new window
function Start-ProcessInNewWindow {
    param (
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$Title
    )
    $ps = New-Object -ComObject WScript.Shell
    $ps.Run("powershell -NoExit -Command `"cd '$WorkingDirectory'; $Command`"`; Read-Host 'Press Enter to close...'")
}

# Start backend server in a new window
Write-Host "Starting backend server..."
$backendDir = "$projectRoot\src\api\sampleBackend"
Start-ProcessInNewWindow -WorkingDirectory $backendDir -Command "npm install; node server.js" -Title "Backend Server"

# Start frontend in a new window
Write-Host "Starting frontend..."
Start-ProcessInNewWindow -WorkingDirectory $projectRoot -Command "npm install; npm run dev" -Title "Frontend"

Write-Host "Setup complete! Both frontend and backend should be starting up..."
Write-Host "Frontend will be available at: http://localhost:5173"
Write-Host "Backend API will be available at: http://localhost:5001"
