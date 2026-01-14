# Script de Despliegue OrdenFi
# Este script inicializa Git y sube a Vercel en un solo paso.

Write-Host "Iniciando despliegue de OrdenFi..." -ForegroundColor Cyan

# 1. Git Init
if (!(Test-Path .git)) {
    Write-Host "Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - OrdenFi v1.0"
} else {
    Write-Host "Git ya inicializado. Sumando cambios..."
    git add .
    git commit -m "Update - OrdenFi"
}

# 2. Vercel Deploy
Write-Host "Subiendo a la nube (Vercel)..." -ForegroundColor Yellow
npx vercel --prod --confirm

# 3. Push to GitHub
Write-Host "Sincronizando con GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "Proceso finalizado! Revisa tu consola para el link de Vercel." -ForegroundColor Green
Pause
