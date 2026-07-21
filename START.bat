@echo off
REM Script para levantar Amaranta en desarrollo rápidamente
REM Compatible con Windows PowerShell

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         🚀 Iniciando Amaranta (Sistema Completo)             ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Paso 1: Verificar Docker
echo [1/4] Verificando Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Docker está disponible
) else (
    echo ⚠️  Docker no está instalado. Usa instalación manual (ver QUICKSTART.md)
)

REM Paso 2: Levantar servicios con Docker Compose
echo [2/4] Levantando MongoDB + Backend con Docker Compose...
docker-compose up -d >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Docker Compose iniciado (MongoDB en 27017, Backend en 5000)
) else (
    echo ⚠️  Docker Compose no disponible. Levanta manualmente:
    echo     - mongodb local o configura MongoDB Atlas en backend\.env
    echo     - cd backend ^&^& npm run dev
)

REM Paso 3: Instalar dependencias frontend
echo [3/4] Instalando dependencias del frontend...
if not exist "node_modules\" (
    call npm install --legacy-peer-deps >nul 2>&1
    echo ✓ Dependencias frontend instaladas
) else (
    echo ✓ Dependencias frontend ya están instaladas
)

REM Paso 4: Crear archivo .env si no existe
echo [4/4] Configurando variables de entorno...
if not exist ".env" (
    (
        echo VITE_API_URL=http://localhost:5000
    ) > .env
    echo ✓ Archivo .env creado
) else (
    echo ✓ Archivo .env ya existe
)

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                  ✅ Listo para usar!                           ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📝 Próximos pasos:
echo.
echo 1️⃣  Inicia el frontend (en esta terminal o en una nueva):
echo     npm run dev
echo.
echo 2️⃣  Abre en tu navegador:
echo     http://localhost:5173
echo.
echo 3️⃣  Inicia sesión con:
echo     Email:    admin@amaranta.com
echo     Password: 123456
echo.
echo 📚 Documentación:
echo    • QUICKSTART.md      - Guía de instalación y uso
echo    • SETUP_COMPLETE.md  - Resumen de arquitectura
echo    • DEVELOPMENT.md     - Guía de desarrollo
echo    • ESTADO.md          - Estado del proyecto
echo.
echo 🔗 URLs importantes:
echo    • Frontend:  http://localhost:5173
echo    • Backend:   http://localhost:5000
echo    • MongoDB:   mongodb://localhost:27017/amaranta
echo.
pause
