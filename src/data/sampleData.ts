import { CourseClass, CourseNote, CourseTask } from '../types/agenda';
import { addDays, getTodayString } from '../utils/dateUtils';

export function getInitialClasses(): CourseClass[] {
  const today = getTodayString();
  return [
    {
      id: 'clase-1',
      title: 'Introducción a Google AI Studio y modelos Gemini',
      topic: 'Módulo 1 · Fundamentos',
      date: today,
      time: '18:00',
      duration: '60 min',
      modality: 'Clase en vivo',
    },
    {
      id: 'clase-2',
      title: 'System Instructions y diseño de prompts claros',
      topic: 'Módulo 2 · Ingeniería de Prompts',
      date: addDays(today, 1),
      time: '18:00',
      duration: '75 min',
      modality: 'Taller práctico',
    },
    {
      id: 'clase-3',
      title: 'Ajuste de temperatura, Top-P y límite de tokens',
      topic: 'Módulo 3 · Parámetros del modelo',
      date: addDays(today, 3),
      time: '19:00',
      duration: '60 min',
      modality: 'Clase en vivo',
    },
    {
      id: 'clase-4',
      title: 'Salidas estructuradas con JSON Schema',
      topic: 'Módulo 4 · Datos estructurados',
      date: addDays(today, 5),
      time: '17:30',
      duration: '90 min',
      modality: 'Laboratorio guiado',
    },
    {
      id: 'clase-5',
      title: 'Pruebas multimodales: texto, imagen y audio',
      topic: 'Módulo 5 · Multimodalidad',
      date: addDays(today, 7),
      time: '18:00',
      duration: '60 min',
      modality: 'Clase en vivo',
    },
  ];
}

export function getInitialTasks(): CourseTask[] {
  const today = getTodayString();
  return [
    {
      id: 'tarea-1',
      title: 'Crear primer proyecto en Google AI Studio',
      description:
        'Ingresar al panel de Google AI Studio, elegir un modelo Gemini y guardar un prompt de prueba con un título claro.',
      dueDate: addDays(today, -1),
      module: 'Módulo 1 · Fundamentos',
      completed: true,
    },
    {
      id: 'tarea-2',
      title: 'Comparar respuestas con temperatura 0.2 y 1.0',
      description:
        'Ejecutar el mismo prompt de resumen con dos valores de temperatura distintos y anotar cómo cambia la creatividad.',
      dueDate: today,
      module: 'Módulo 3 · Parámetros del modelo',
      completed: false,
    },
    {
      id: 'tarea-3',
      title: 'Redactar 3 System Instructions para distintos roles',
      description:
        'Escribir instrucciones de sistema para un tutor de inglés, un corrector de textos y un asistente de recetas.',
      dueDate: addDays(today, 1),
      module: 'Módulo 2 · Ingeniería de Prompts',
      completed: false,
    },
    {
      id: 'tarea-4',
      title: 'Definir un esquema JSON para extraer datos de facturas',
      description:
        'Activar Structured Outputs en Google AI Studio y probar la extracción de fecha, comercio y monto total.',
      dueDate: addDays(today, 4),
      module: 'Módulo 4 · Datos estructurados',
      completed: false,
    },
    {
      id: 'tarea-5',
      title: 'Revisar guía oficial de buenas prácticas de seguridad',
      description:
        'Leer la sección de Safety Settings y probar filtros moderados y estrictos en un flujo de chat.',
      dueDate: addDays(today, -2),
      module: 'Módulo 1 · Fundamentos',
      completed: true,
    },
  ];
}

export function getInitialNotes(): CourseNote[] {
  const today = getTodayString();
  return [
    {
      id: 'nota-1',
      title: 'Cuándo usar System Instructions vs. el mensaje del usuario',
      topic: 'Ingeniería de Prompts',
      content:
        'Las System Instructions definen el rol permanente, el tono de respuesta y las reglas que el modelo debe respetar en toda la conversación. En el mensaje del usuario conviene colocar únicamente los datos o la pregunta puntual de cada turno.',
      updatedAt: today,
    },
    {
      id: 'nota-2',
      title: 'Resumen rápido de Temperatura y Top-P',
      topic: 'Parámetros del modelo',
      content:
        'Temperatura baja (0.0 a 0.3): respuestas más consistentes y directas, ideal para extraer datos o resumir. Temperatura alta (0.8 a 1.2): mayor variedad de redacción, útil para lluvia de ideas y borradores creativos.',
      updatedAt: addDays(today, -1),
    },
    {
      id: 'nota-3',
      title: 'Ventajas de Structured Outputs en JSON',
      topic: 'Datos estructurados',
      content:
        'Cuando se define un esquema JSON en Google AI Studio, el modelo devuelve exactamente los campos y tipos esperados (texto, número, lista o booleano), evitando texto adicional que rompa la integración.',
      updatedAt: addDays(today, -2),
    },
    {
      id: 'nota-4',
      title: 'Checklist antes de exportar código con "Get Code"',
      topic: 'Integración y API',
      content:
        '1. Verificar que el modelo elegido sea el adecuado para producción.\n2. Confirmar que el límite de tokens de salida cubra la respuesta esperada.\n3. Guardar la clave API en variables de entorno y nunca exponerla en el navegador.',
      updatedAt: addDays(today, -3),
    },
  ];
}
