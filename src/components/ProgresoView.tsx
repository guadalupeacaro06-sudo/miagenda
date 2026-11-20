import { ArrowRight, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { CourseClass, CourseNote, CourseTask, TabId } from '../types/agenda';
import { formatShortDate } from '../utils/dateUtils';

interface ProgresoViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
  onToggleTask: (id: string) => void;
  onNavigate: (tab: TabId) => void;
  onRequestReset: () => void;
}

export function ProgresoView({
  classes,
  tasks,
  notes,
  onToggleTask,
  onNavigate,
  onRequestReset,
}: ProgresoViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de resumen */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Anillo de progreso SVG */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 104 104" aria-hidden="true">
                <circle
                  cx="52"
                  cy="52"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="52"
                  cy="52"
                  r={radius}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-900 tabular-nums">
                {percentage}%
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Tu progreso en el curso
              </h2>
              <p className="mt-1 text-base text-slate-600 leading-relaxed tabular-nums">
                Has completado{' '}
                <span className="font-bold text-slate-900">
                  {completedTasks.length} de {totalTasks}
                </span>{' '}
                tareas registradas.
              </p>
            </div>
          </div>
        </div>

        {/* Métricas en cuadrícula */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800">Tareas completadas</p>
            <p className="mt-1 text-2xl font-bold text-emerald-950 tabular-nums">
              {completedTasks.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-800">Tareas pendientes</p>
            <p className="mt-1 text-2xl font-bold text-amber-950 tabular-nums">
              {pendingTasks.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600">Clases agendadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {classes.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600">Notas guardadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {notes.length}
            </p>
          </div>
        </div>
      </section>

      {/* Desglose de tareas pendientes y completadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Pendientes ({pendingTasks.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1 whitespace-nowrap"
            >
              <span>Ir a Tareas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="text-base text-slate-600 py-2">
              No tienes tareas pendientes por entregar.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingTasks.map((tarea) => (
                <div key={tarea.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 tabular-nums">
                      Entrega: {formatShortDate(tarea.dueDate)} · {tarea.module}
                    </p>
                    <p className="text-base font-bold text-slate-900">{tarea.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTask(tarea.id)}
                    className="min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-emerald-800 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar completada</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Completadas ({completedTasks.length})</span>
          </h3>

          {completedTasks.length === 0 ? (
            <p className="text-base text-slate-600 py-2">
              Aún no has completado ninguna tarea.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {completedTasks.map((tarea) => (
                <div key={tarea.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 tabular-nums">
                      Entrega: {formatShortDate(tarea.dueDate)} · {tarea.module}
                    </p>
                    <p className="text-base font-semibold text-slate-600 line-through">
                      {tarea.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTask(tarea.id)}
                    className="min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Devolver a pendientes</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Opción sencilla para restaurar ejemplos */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Datos de ejemplo del curso
          </h3>
          <p className="text-sm text-slate-600">
            Si editaste o eliminaste elementos y quieres volver a ver la agenda inicial de Google AI Studio, puedes restaurarla aquí.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestReset}
          className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurar datos de ejemplo</span>
        </button>
      </section>
    </div>
  );
}
