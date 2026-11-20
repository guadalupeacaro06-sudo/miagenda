import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  FilePlus2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask, TabId } from '../types/agenda';
import { formatLongDate, formatShortDate, getTodayString } from '../utils/dateUtils';

interface InicioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: () => void;
  onQuickAddTask: (title: string, dueDate: string) => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTask: (id: string) => void;
  onAddNote: () => void;
}

export function InicioView({
  classes,
  tasks,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onQuickAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onAddNote,
}: InicioViewProps) {
  const today = getTodayString();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = quickTitle.trim();
    if (!cleaned) {
      setQuickError('Debes escribir una actividad antes de agregarla.');
      return;
    }
    onQuickAddTask(cleaned, quickDate.trim() || getTodayString());
    setQuickTitle('');
    setQuickDate('');
    setQuickError(null);
  };

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Encabezado de resumen */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <p className="text-sm font-medium text-slate-500">
          {formatLongDate(today)}
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
          Curso de Google AI Studio
        </h2>
        <p className="mt-2 text-base text-slate-600 leading-relaxed">
          Tienes{' '}
          <span className="font-semibold text-slate-900 tabular-nums">
            {pendingTasks.length} {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
          </span>{' '}
          y{' '}
          <span className="font-semibold text-slate-900 tabular-nums">
            {upcomingClasses.length} {upcomingClasses.length === 1 ? 'próxima clase' : 'próximas clases'}
          </span>{' '}
          para esta semana.
        </p>

        {/* Botones rápidos grandes */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar tarea</span>
          </button>
          <button
            type="button"
            onClick={onAddClass}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold text-base flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <CalendarPlus className="w-5 h-5 shrink-0 text-blue-700" />
            <span>Agregar clase</span>
          </button>
          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold text-base flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <FilePlus2 className="w-5 h-5 shrink-0 text-blue-700" />
            <span>Crear nota</span>
          </button>
        </div>
      </section>

      {/* Formulario rápido para agregar una actividad con fecha opcional */}
      <section
        aria-label="Agregar actividad rápida"
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Agregar actividad rápida
          </h3>
          <p className="text-sm text-slate-600">
            Anota una actividad pendiente al instante; si no eliges fecha, se guarda para hoy.
          </p>
        </div>

        <form onSubmit={handleQuickSubmit} noValidate className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label htmlFor="quick-activity" className="sr-only">
                Nombre de la actividad
              </label>
              <input
                id="quick-activity"
                type="text"
                value={quickTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuickTitle(val);
                  if (val.trim()) setQuickError(null);
                }}
                placeholder="Escribe una actividad..."
                aria-invalid={quickError ? 'true' : 'false'}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  quickError
                    ? 'border-red-500 bg-red-50/40 focus:border-red-600 focus:ring-red-600/20'
                    : 'border-slate-300 bg-white focus:border-blue-700 focus:ring-blue-700/20'
                }`}
              />
            </div>

            <div className="sm:col-span-5 relative">
              <label htmlFor="quick-date" className="sr-only">
                Fecha de entrega (opcional)
              </label>
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="quick-date"
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full min-h-[48px] pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>
          </div>

          {quickError && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {quickError}
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar actividad</span>
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Próximas clases */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">Próximas clases</h3>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver calendario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <p className="text-base text-slate-600">
                No tienes próximas clases programadas.
              </p>
              <button
                type="button"
                onClick={onAddClass}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base inline-flex items-center gap-2 hover:bg-blue-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar clase</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((clase) => (
                <article
                  key={clase.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500">
                        {clase.topic}
                      </p>
                      <h4 className="mt-0.5 text-base font-bold text-slate-900 leading-snug">
                        {clase.title}
                      </h4>
                      <p className="mt-1.5 text-sm text-slate-600 tabular-nums flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold text-blue-800">
                          {formatShortDate(clase.date)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{clase.time} h</span>
                        <span aria-hidden="true">·</span>
                        <span>{clase.duration}</span>
                        <span aria-hidden="true">·</span>
                        <span>{clase.modality}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClass(clase)}
                      className="min-h-[44px] flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(clase)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 text-red-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Tareas pendientes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">Tareas pendientes</h3>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver todas ({tasks.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <p className="text-base font-medium text-emerald-800">
                ¡Excelente! Completaste todas tus tareas ({completedCount}/{tasks.length}).
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base inline-flex items-center gap-2 hover:bg-blue-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar nueva tarea</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((tarea) => (
                <article
                  key={tarea.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Pendiente</span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-slate-600 tabular-nums">
                        Entrega: {formatShortDate(tarea.dueDate)}
                      </span>
                    </div>
                    <h4 className="mt-1 text-base font-bold text-slate-900 leading-snug">
                      {tarea.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {tarea.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleTask(tarea.id)}
                      className="min-h-[44px] flex-1 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-800 transition-colors whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Marcar completada</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(tarea)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(tarea)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 text-red-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
