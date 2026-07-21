#!/bin/bash
# Script para levantar Amaranta en desarrollo rápidamente

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         🚀 Iniciando Amaranta (Sistema Completo)             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Verificar Docker
echo -e "${BLUE}Paso 1/4: Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker no está instalado. Usa instalación manual (ver QUICKSTART.md)${NC}"
else
    echo -e "${GREEN}✓ Docker está disponible${NC}"
fi

# Paso 2: Levantar servicios con Docker Compose
echo -e "${BLUE}Paso 2/4: Levantando MongoDB + Backend con Docker Compose...${NC}"
docker-compose up -d 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker Compose iniciado (MongoDB en 27017, Backend en 5000)${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose no disponible. Levanta manualmente:${NC}"
    echo "     mongodb local o configura MongoDB Atlas en backend/.env"
    echo "     cd backend && npm run dev"
fi

# Paso 3: Instalar dependencias frontend
echo -e "${BLUE}Paso 3/4: Instalando dependencias del frontend...${NC}"
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps > /dev/null 2>&1
    echo -e "${GREEN}✓ Dependencias frontend instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependencias frontend ya están instaladas${NC}"
fi

# Paso 4: Crear archivo .env si no existe
echo -e "${BLUE}Paso 4/4: Configurando variables de entorno...${NC}"
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000" > .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Listo para usar!                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1️⃣  Inicia el frontend (en esta terminal o en una nueva):"
echo "    ${GREEN}npm run dev${NC}"
echo ""
echo "2️⃣  Abre en tu navegador:"
echo "    ${GREEN}http://localhost:5173${NC}"
echo ""
echo "3️⃣  Inicia sesión con:"
echo "    Email:    ${YELLOW}admin@amaranta.com${NC}"
echo "    Password: ${YELLOW}123456${NC}"
echo ""
echo "📚 Documentación:"
echo "   • QUICKSTART.md      → Guía de instalación y uso"
echo "   • SETUP_COMPLETE.md  → Resumen de arquitectura"
echo "   • DEVELOPMENT.md     → Guía de desarrollo"
echo "   • ESTADO.md          → Estado del proyecto"
echo ""
echo "🔗 URLs importantes:"
echo "   • Frontend:  http://localhost:5173"
echo "   • Backend:   http://localhost:5000"
echo "   • MongoDB:   mongodb://localhost:27017/amaranta"
echo ""
