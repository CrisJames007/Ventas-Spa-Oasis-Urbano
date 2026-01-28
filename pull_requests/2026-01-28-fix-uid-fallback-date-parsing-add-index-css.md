### Pull Request Title
fix: uid fallback, date parsing, add index.css

### Body
Qué hace:
- Añade index.css para evitar 404 y aplicar estilos globales mínimos.
- Añade util utils/uid.ts para generar IDs con fallback en entornos sin crypto.randomUUID().
- Sustituye crypto.randomUUID() por uid() en App.tsx.
- Evita la eliminación accidental de empleados: confirma si el empleado tiene ventas asociadas.
- Corrige el parseo de fechas en MonthlySummary para evitar problemas de timezone.

### Por qué:
- Mejor compatibilidad cross-browser / entornos de test.
- Evita errores de fecha por interpretación UTC.
- Previene borrados accidentales que crean inconsistencias.