import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CourseClass, CourseNote, CourseTask, ModalState } from '../types/agenda';
import { getTodayString } from '../utils/dateUtils';

interface AgendaModalProps {
  modal: ModalState;
  onClose: () => void;
  onSaveClass: (data: Omit<CourseClass, 'id'>, editId?: string) => void;
  onSaveTask: (data: Omit<CourseTask, 'id'>, editId?: string) => void;
  onSaveNote: (data: Omit<CourseNote, 'id'>, editId?: string) => void;
  onConfirmDelete: (entityType: 'clase' | 'tarea' | 'nota', id: string) => void;
  onConfirmReset: () => void;
}

export function AgendaModal({
  modal,
  onClose,
  onSaveClass,
  onSaveTask,
  onSaveNote,
  onConfirmDelete,
  onConfirmReset,
}: AgendaModalProps) {
  const today = getTodayString();

  // Class form state
  const [classTitle, setClassTitle] = useState('');
  const [classTopic, setClassTopic] = useState('');
  const [classDate, setClassDate] = useState(today);
  const [classTime, setClassTime] = useState('18:00');
  const [classDuration, setClassDuration] = useState('60 min');
  const [classModality, setClassModality] = useState('Clase en vivo');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(today);
  const [taskModule, setTaskModule] = useState('Módulo 1 · Fundamentos');
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTopic, setNoteTopic] = useState('Ingeniería de Prompts');
  const [noteContent, setNoteContent] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (modal.type === 'class-form') {
      if (modal.mode === 'edit' && modal.item) {
        setClassTitle(modal.item.title);
        setClassTopic(modal.item.topic);
        setClassDate(modal.item.date);
        setClassTime(modal.item.time);
        setClassDuration(modal.item.duration);
        setClassModality(modal.item.modality);
      } else {
        setClassTitle('');
        setClassTopic('Curso de Google AI Studio');
        setClassDate(modal.defaultDate || today);
        setClassTime('18:00');
        setClassDuration('60 min');
        setClassModality('Clase en vivo');
      }
    } else if (modal.type === 'task-form') {
      if (modal.mode === 'edit' && modal.item) {
        setTaskTitle(modal.item.title);
        setTaskDescription(modal.item.description);
        setTaskDueDate(modal.item.dueDate);
        setTaskModule(modal.item.module);
        setTaskCompleted(modal.item.completed);
      } else {
        setTaskTitle('');
        setTaskDescription('');
        setTaskDueDate(modal.defaultDate || today);
        setTaskModule('Curso de Google AI Studio');
        setTaskCompleted(false);
      }
    } else if (modal.type === 'note-form') {
      if (modal.mode === 'edit' && modal.item) {
        setNoteTitle(modal.item.title);
        setNoteTopic(modal.item.topic);
        setNoteContent(modal.item.content);
      } else {
        setNoteTitle('');
        setNoteTopic('Ingeniería de Prompts');
        setNoteContent('');
      }
    }
  }, [modal, today]);

  useEffect(() => {
    if (modal.type === 'closed') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.type, onClose]);

  if (modal.type === 'closed') return null;

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle.trim()) {
      setErrorMsg('Escribe un nombre para la clase.');
      return;
    }
    onSaveClass(
      {
        title: classTitle.trim(),
        topic: classTopic.trim() || 'Curso de Google AI Studio',
        date: classDate || today,
        time: classTime || '18:00',
        duration: classDuration.trim() || '60 min',
        modality: classModality.trim() || 'Clase en vivo',
      },
      modal.type === 'class-form' && modal.mode === 'edit' ? modal.item?.id : undefined
    );
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setErrorMsg('Escribe el nombre de la tarea.');
      return;
    }
    onSaveTask(
      {
        title: taskTitle.trim(),
        description: taskDescription.trim() || 'Sin descripción adicional.',
        dueDate: taskDueDate || today,
        module: taskModule.trim() || 'Curso de Google AI Studio',
        completed: taskCompleted,
      },
      modal.type === 'task-form' && modal.mode === 'edit' ? modal.item?.id : undefined
    );
    onClose();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      setErrorMsg('Completa el título y el contenido de la nota.');
      return;
    }
    onSaveNote(
      {
        title: noteTitle.trim(),
        topic: noteTopic.trim() || 'Apuntes generales',
        content: noteContent.trim(),
        updatedAt: today,
      },
      modal.type === 'note-form' && modal.mode === 'edit' ? modal.item?.id : undefined
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {modal.type === 'class-form' &&
              (modal.mode === 'edit' ? 'Editar clase' : 'Agregar nueva clase')}
            {modal.type === 'task-form' &&
              (modal.mode === 'edit' ? 'Editar tarea' : 'Agregar nueva tarea')}
            {modal.type === 'note-form' &&
              (modal.mode === 'edit' ? 'Editar nota' : 'Crear nueva nota')}
            {modal.type === 'confirm-delete' && `Eliminar ${modal.entityType}`}
            {modal.type === 'confirm-reset' && 'Restaurar datos de ejemplo'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-800">
              {errorMsg}
            </div>
          )}

          {modal.type === 'class-form' && (
            <form id="class-form" onSubmit={handleClassSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-title">
                  Nombre de la clase
                </label>
                <input
                  id="class-title"
                  type="text"
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="Ej. Diseño de prompts con Gemini"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-topic">
                  Módulo o tema
                </label>
                <input
                  id="class-topic"
                  type="text"
                  value={classTopic}
                  onChange={(e) => setClassTopic(e.target.value)}
                  placeholder="Ej. Módulo 2 · Ingeniería de Prompts"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-date">
                    Fecha
                  </label>
                  <input
                    id="class-date"
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-time">
                    Hora
                  </label>
                  <input
                    id="class-time"
                    type="time"
                    value={classTime}
                    onChange={(e) => setClassTime(e.target.value)}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-duration">
                    Duración
                  </label>
                  <input
                    id="class-duration"
                    type="text"
                    value={classDuration}
                    onChange={(e) => setClassDuration(e.target.value)}
                    placeholder="Ej. 60 min"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="class-modality">
                    Modalidad
                  </label>
                  <select
                    id="class-modality"
                    value={classModality}
                    onChange={(e) => setClassModality(e.target.value)}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Clase en vivo">Clase en vivo</option>
                    <option value="Taller práctico">Taller práctico</option>
                    <option value="Laboratorio guiado">Laboratorio guiado</option>
                    <option value="Video grabado">Video grabado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 active:scale-[0.99] transition-all"
                >
                  {modal.mode === 'edit' ? 'Guardar cambios' : 'Guardar clase'}
                </button>
              </div>
            </form>
          )}

          {modal.type === 'task-form' && (
            <form id="task-form" onSubmit={handleTaskSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="task-title">
                  Nombre de la tarea o actividad
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (e.target.value.trim()) setErrorMsg('');
                  }}
                  placeholder="Ej. Probar esquema JSON en AI Studio"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="task-desc">
                  Descripción
                </label>
                <textarea
                  id="task-desc"
                  rows={3}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe qué pasos debes realizar..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="task-date">
                    Fecha de entrega (hoy por defecto)
                  </label>
                  <input
                    id="task-date"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="task-module">
                    Tema del curso
                  </label>
                  <input
                    id="task-module"
                    type="text"
                    value={taskModule}
                    onChange={(e) => setTaskModule(e.target.value)}
                    placeholder="Ej. Módulo 3 · Parámetros"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Estado actual
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTaskCompleted(false)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      !taskCompleted
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pendiente
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskCompleted(true)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      taskCompleted
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Completada
                  </button>
                </div>
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 active:scale-[0.99] transition-all"
                >
                  {modal.mode === 'edit' ? 'Guardar cambios' : 'Guardar tarea'}
                </button>
              </div>
            </form>
          )}

          {modal.type === 'note-form' && (
            <form id="note-form" onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="note-title">
                  Título de la nota
                </label>
                <input
                  id="note-title"
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ej. Reglas para System Instructions"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="note-topic">
                  Tema del curso
                </label>
                <input
                  id="note-topic"
                  type="text"
                  value={noteTopic}
                  onChange={(e) => setNoteTopic(e.target.value)}
                  placeholder="Ej. Ingeniería de Prompts"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="note-content">
                  Apuntes
                </label>
                <textarea
                  id="note-content"
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Escribe aquí tus apuntes o ideas clave de la clase..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base text-slate-900 leading-relaxed focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 active:scale-[0.99] transition-all"
                >
                  {modal.mode === 'edit' ? 'Guardar cambios' : 'Guardar nota'}
                </button>
              </div>
            </form>
          )}

          {modal.type === 'confirm-delete' && (
            <div className="space-y-5">
              <p className="text-base text-slate-700 leading-relaxed">
                ¿Seguro que quieres eliminar esta {modal.entityType}?
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                {modal.title}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirmDelete(modal.entityType, modal.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-red-700 text-white font-semibold text-base hover:bg-red-800 transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}

          {modal.type === 'confirm-reset' && (
            <div className="space-y-5">
              <p className="text-base text-slate-700 leading-relaxed">
                Se volverán a cargar las clases, tareas y notas iniciales de ejemplo sobre Google AI Studio. Los cambios actuales se reemplazarán.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirmReset();
                    onClose();
                  }}
                  className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 transition-colors"
                >
                  Sí, restaurar ejemplos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
