# Run backend from backend folder. Uses the venv's Python so dependencies (e.g. sqlalchemy) are found.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$venvPython = ".\.venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "Create venv first: python -m venv .venv" -ForegroundColor Yellow
    Write-Host "Then: .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

& $venvPython -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
