import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { CourseTask } from '../types/agenda';
import { formatShortDate } from '../utils/dateUtils';

interface TareasViewProps {
  tasks: CourseTask[];
  onAddTask: () => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTask: (id: string) => void;
}

export function TareasView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: TareasViewProps) {
  const [filter, setFilter] = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filter === 'pendientes' && t.completed) return false;
      if (filter === 'completadas' && !t.completed) return false;
      if (normalizedQuery && !t.title.toLowerCase().includes(normalizedQuery)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-5">
      {/* Cabecera y botón principal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tareas del curso
            </h2>
            <p className="text-sm text-slate-600 tabular-nums">
              {pendingCount} pendientes · {completedCount} completadas
            </p>
          </div>
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar nueva tarea</span>
          </button>
        </div>

        {/* Filtro por estado */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'todas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendientes')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'pendientes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completadas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'completadas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </div>

      {/* Tarjeta compacta de resumen de progreso */}
      <section
        aria-label="Resumen de tareas completadas"
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2.5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Progreso de tareas
            </h3>
            <p className="text-xs text-slate-600 tabular-nums">
              {completedCount} de {totalCount}{' '}
              {totalCount === 1 ? 'tarea completada' : 'tareas completadas'}
            </p>
          </div>
          <span className="text-xl font-bold text-blue-700 tabular-nums">
            {completionPercentage}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Porcentaje de tareas completadas"
          className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"
        >
          <div
            className="h-full rounded-full bg-blue-700 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </section>

      {/* Barra de búsqueda en tiempo real encima de la lista de tareas */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tarea por nombre..."
          aria-label="Buscar tarea por nombre"
          className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            {normalizedQuery
              ? 'No se encontraron tareas con ese nombre.'
              : filter === 'pendientes'
              ? 'No tienes tareas pendientes.'
              : filter === 'completadas'
              ? 'Todavía no has marcado tareas como completadas.'
              : 'No hay tareas guardadas todavía.'}
          </p>
          {normalizedQuery ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50"
            >
              Limpiar búsqueda
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddTask}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base inline-flex items-center gap-2 hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar nueva tarea</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((tarea) => (
            <article
              key={tarea.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
                  {tarea.completed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Completada</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Pendiente</span>
                    </span>
                  )}
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="text-slate-600 tabular-nums">
                    Entrega: {formatShortDate(tarea.dueDate)}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="text-slate-500 font-medium">{tarea.module}</span>
                </div>

                <h3
                  className={`text-lg font-bold leading-snug ${
                    tarea.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {tarea.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {tarea.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleTask(tarea.id)}
                  className={`min-h-[44px] flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                    tarea.completed
                      ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                >
                  {tarea.completed ? (
                    <>
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>Marcar pendiente</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Marcar completada</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onEditTask(tarea)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar tarea</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(tarea)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/70 text-red-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
