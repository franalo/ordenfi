# Documentación Técnica: OrdenFi 🚀

## 1. Resumen del Proyecto
**OrdenFi** es una aplicación web de gestión financiera personal diseñada con una estética "Premium Dark". Permite a los usuarios trackear sus inversiones, planificar su flujo de caja mensual y analizar su salud financiera mediante reportes detallados.

### Tecnologías Core:
- **Frontend**: React.js con Vite.
- **Iconografía**: Lucide React.
- **Estilos**: Vanilla CSS con variables personalizadas (Modern Glassmorphism).
- **Base de Datos**: Mock DB (LocalStorage) para persistencia local inmediata.

---

## 2. Funcionalidades Implementadas

### A. Dashboard General
- Resumen de **Liquidez Unificada** (ARS y USD).
- Cálculo de **Patrimonio Total** (Activos + Efectivo).
- **Operaciones Manuales**: Compra y Venta de activos con selección de moneda.
- **Sugerencias de Inversión**: Algoritmo que distribuye un monto entre activos según perfiles de riesgo (Conservador, Moderado, Agresivo).

### B. Planificador de Flujo de Caja (Cashflow)
- Registro de **Ingresos y Egresos** en multimoneda.
- **Proyección de Cuotas**: Los gastos pueden ser marcados como cuotas, y el sistema los proyecta automáticamente en meses futuros.
- **Sugerencia de TC**: Cálculo inteligente del tipo de cambio sugerido según la fecha, con opción de edición manual.
- **Integración**: Botón "Invertir Remanente" que lleva el excedente mensual al Dashboard.

### C. Portafolio & Tenencias
- Tabla detallada de **Tenencias Actuales**.
- Inclusión de **CASH (ARS/USD)** como parte del portafolio.
- Historial de transacciones con opción de **Eliminar/Revertir**.

### D. Sistema de Reportes
- Análisis de **Tasa de Ahorro**.
- **Eficiencia de Inversión** (Monto invertido / Ingresos).
- Gráficos de barra para flujos de caja por mes.

---

## 3. ¿Qué falta para estar 100% Funcional? (Production Ready)

Para que esta aplicación pase de ser un prototipo avanzado a un producto real de mercado, se requieren los siguientes pasos:

1. **Persistencia Real (Backend)**:
   - Reemplazar LocalStorage por una base de datos real (e.g., **Supabase**, **Firebase** o Postgres).
   - Actualmente, si el usuario borra la caché del navegador, pierde sus datos.

2. **Autenticación de Usuarios**:
   - Implementar un sistema de Login real (JWT, OAuth o Supabase Auth).
   - El login actual es simulado por motivos de desarrollo.

3. **Integración de APIs Financieras**:
   - **Precios en tiempo real**: Conectar con APIs como AlphaVantage o Yahoo Finance para obtener precios reales de acciones/cripto.
   - **Tipos de Cambio**: Usar una API como `dolarapi.com` para obtener el MEP/Blue real de Argentina en tiempo real.

4. **Validación de Formularios Robusta**:
   - Agregar manejo de errores más detallado y validaciones de tipos de datos antes de guardar en DB.

5. **Exportación de Datos**:
   - Funcionalidad para descargar el historial o reportes en formato **CSV** o **PDF**.

6. **Despliegue Continuo (CI/CD)**:
   - Configurar acciones de GitHub para que cada cambio se suba automáticamente a producción.

---

## 4. Instrucciones de Despliegue (Local)
```bash
npm install
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`.
