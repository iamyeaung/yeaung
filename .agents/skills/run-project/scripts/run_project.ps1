param (
    [Parameter(Mandatory=$true, HelpMessage="Command to execute: setup, start-offline, reboot, stop")]
    [string]$Command
)

# Navigate to the root directory assuming script is in .agents/skills/run-project/scripts/
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..\..\..\..\")
Push-Location $RootDir

switch ($Command) {
    "setup" {
        Write-Host "Running Setup (Build & Start)... Note: Requires Internet/VPN!" -ForegroundColor Cyan
        docker-compose up -d --build
    }
    "start-offline" {
        Write-Host "Running Start Offline... No Internet required." -ForegroundColor Cyan
        docker-compose up -d
    }
    "reboot" {
        Write-Host "Rebooting containers..." -ForegroundColor Cyan
        docker-compose restart
    }
    "stop" {
        Write-Host "Stopping containers..." -ForegroundColor Cyan
        docker-compose down
    }
    Default {
        Write-Host "Error: Unknown command '$Command'." -ForegroundColor Red
        Write-Host "Available commands: setup, start-offline, reboot, stop" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
}

Pop-Location
