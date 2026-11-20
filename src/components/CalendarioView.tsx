import { useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask } from '../types/agenda';
import {
  addDays,
  formatLongDate,
  formatMonthRange,
  formatShortDate,
  getDayNumber,
  getTodayString,
  getWeekDays,
  getWeekStartMonday,
  getWeekdayShort,
} from '../utils/dateUtils';

interface CalendarioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClass: (defaultDate?: string) => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: (defaultDate?: string) => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTask: (id: string) => void;
}

export function CalendarioView({
  classes,
  tasks,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: CalendarioViewProps) {
  const today = getTodayString();
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [weekStart, setWeekStart] = useState<string>(getWeekStartMonday(today));

  const weekDays = getWeekDays(weekStart);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setWeekStart(getWeekStartMonday(dateStr));
  };

  const handleGoToday = () => {
    setSelectedDate(today);
    setWeekStart(getWeekStartMonday(today));
  };

  const handleChangeWeek = (deltaDays: number) => {
    const nextStart = addDays(weekStart, deltaDays);
    setWeekStart(nextStart);
    setSelectedDate(addDays(selectedDate, deltaDays));
  };

  const dayClasses = classes
    .filter((c) => c.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-5">
      {/* Cabecera de Calendario y selector Día / Semana */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Calendario de actividades
            </h2>
            <p className="text-sm text-slate-600">
              Semana del {formatMonthRange(weekStart)}
            </p>
          </div>

          {/* Segmented control Por día / Por semana */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl sm:w-64">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'dia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por día
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'semana'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por semana
            </button>
          </div>
        </div>

        {/* Controles de navegación de semana */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleChangeWeek(-7)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-1 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Semana anterior</span>
          </button>

          <button
            type="button"
            onClick={handleGoToday}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-50 text-blue-800 text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            Ir a hoy
          </button>

          <button
            type="button"
            onClick={() => handleChangeWeek(7)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-1 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tira de días de la semana */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weekDays.map((dayStr) => {
            const isSelected = dayStr === selectedDate;
            const isToday = dayStr === today;
            const count =
              classes.filter((c) => c.date === dayStr).length +
              tasks.filter((t) => t.dueDate === dayStr).length;

            return (
              <button
                key={dayStr}
                type="button"
                onClick={() => handleSelectDate(dayStr)}
                className={`min-h-[60px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : isToday
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {getWeekdayShort(dayStr)}
                </span>
                <span className="text-base font-bold tabular-nums">
                  {getDayNumber(dayStr)}
                </span>
                <span
                  className={`text-[10px] font-semibold tabular-nums ${
                    isSelected
                      ? 'text-blue-100'
                      : count > 0
                      ? 'text-blue-700'
                      : 'text-transparent'
                  }`}
                >
                  {count > 0 ? `${count} act.` : '·'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vista Por Día */}
      {viewMode === 'dia' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {formatLongDate(selectedDate)}
              </h3>
              <p className="text-sm text-slate-600 tabular-nums">
                {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'} · {dayTasks.length}{' '}
                {dayTasks.length === 1 ? 'entrega de tarea' : 'entregas de tareas'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAddClass(selectedDate)}
                className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                <CalendarPlus className="w-4 h-4 shrink-0" />
                <span>Agregar clase este día</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTask(selectedDate)}
                className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Agregar tarea este día</span>
              </button>
            </div>
          </div>

          {dayClasses.length === 0 && dayTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-base font-semibold text-slate-800">
                No hay actividades registradas para este día
              </p>
              <p className="text-sm text-slate-600">
                Usa los botones de arriba para programar una clase o una entrega de tarea.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayClasses.map((clase) => (
                <article
                  key={clase.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-blue-800">
                        Clase · {clase.time} h · {clase.duration}
                      </p>
                      <h4 className="mt-0.5 text-base font-bold text-slate-900">
                        {clase.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {clase.topic} · {clase.modality}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClass(clase)}
                      className="min-h-[44px] flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(clase)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 text-red-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}

              {dayTasks.map((tarea) => (
                <article
                  key={tarea.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        tarea.completed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {tarea.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold ${
                          tarea.completed ? 'text-emerald-800' : 'text-amber-800'
                        }`}
                      >
                        Entrega de tarea · {tarea.completed ? 'Completada' : 'Pendiente'}
                      </p>
                      <h4
                        className={`mt-0.5 text-base font-bold ${
                          tarea.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {tarea.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">{tarea.description}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleTask(tarea.id)}
                      className={`min-h-[44px] flex-1 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                        tarea.completed
                          ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {tarea.completed ? 'Marcar pendiente' : 'Marcar completada'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(tarea)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(tarea)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 text-red-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
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
      )}

      {/* Vista Por Semana */}
      {viewMode === 'semana' && (
        <section className="space-y-3">
          {weekDays.map((dayStr) => {
            const itemsClasses = classes
              .filter((c) => c.date === dayStr)
              .sort((a, b) => a.time.localeCompare(b.time));
            const itemsTasks = tasks.filter((t) => t.dueDate === dayStr);
            const isToday = dayStr === today;

            return (
              <div
                key={dayStr}
                className={`bg-white rounded-2xl border p-4 sm:p-5 space-y-3 ${
                  isToday ? 'border-blue-300' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {formatLongDate(dayStr)}
                      {isToday && (
                        <span className="ml-2 text-sm font-semibold text-blue-700">
                          · Hoy
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {itemsClasses.length} {itemsClasses.length === 1 ? 'clase' : 'clases'} · {itemsTasks.length}{' '}
                      {itemsTasks.length === 1 ? 'tarea' : 'tareas'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(dayStr);
                      setViewMode('dia');
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 text-sm font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    Ver día
                  </button>
                </div>

                {itemsClasses.length === 0 && itemsTasks.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Sin clases ni entregas programadas.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {itemsClasses.map((clase) => (
                      <div
                        key={clase.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-blue-700 tabular-nums">
                            Clase · {clase.time} h · {clase.modality}
                          </p>
                          <p className="text-sm font-bold text-slate-900">{clase.title}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onEditClass(clase)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(clase)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-800 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}

                    {itemsTasks.map((tarea) => (
                      <div
                        key={tarea.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold ${
                              tarea.completed ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            Tarea ({formatShortDate(tarea.dueDate)}) ·{' '}
                            {tarea.completed ? 'Completada' : 'Pendiente'}
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              tarea.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {tarea.title}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onToggleTask(tarea.id)}
                            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-semibold ${
                              tarea.completed
                                ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800'
                            }`}
                          >
                            {tarea.completed ? 'Marcar pendiente' : 'Completar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditTask(tarea)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
