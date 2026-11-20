import { useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  GraduationCap,
  Home,
} from 'lucide-react';
import { AgendaModal } from './components/AgendaModal';
import { CalendarioView } from './components/CalendarioView';
import { InicioView } from './components/InicioView';
import { NotasView } from './components/NotasView';
import { ProgresoView } from './components/ProgresoView';
import { TareasView } from './components/TareasView';
import {
  getInitialClasses,
  getInitialNotes,
  getInitialTasks,
} from './data/sampleData';
import {
  CourseClass,
  CourseNote,
  CourseTask,
  ModalState,
  TabId,
} from './types/agenda';

const STORAGE_KEY = 'mi_agenda_aprendizaje_v1';

interface StoredData {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
}

function loadInitialState(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredData>;
      if (
        Array.isArray(parsed.classes) &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.notes)
      ) {
        return {
          classes: parsed.classes,
          tasks: parsed.tasks,
          notes: parsed.notes,
        };
      }
    }
  } catch {
    // Si hay error de lectura, usar datos iniciales
  }
  return {
    classes: getInitialClasses(),
    tasks: getInitialTasks(),
    notes: getInitialNotes(),
  };
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'notas', label: 'Notas', icon: FileText },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
];

export default function App() {
  const [initial] = useState<StoredData>(() => loadInitialState());
  const [classes, setClasses] = useState<CourseClass[]>(initial.classes);
  const [tasks, setTasks] = useState<CourseTask[]>(initial.tasks);
  const [notes, setNotes] = useState<CourseNote[]>(initial.notes);

  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ classes, tasks, notes })
      );
    } catch {
      // Ignorar si almacenamiento está lleno o restringido
    }
  }, [classes, tasks, notes]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSaveClass = (data: Omit<CourseClass, 'id'>, editId?: string) => {
    if (editId) {
      setClasses((prev) =>
        prev.map((item) => (item.id === editId ? { ...data, id: editId } : item))
      );
      showToast('Clase actualizada.');
    } else {
      const newClass: CourseClass = {
        ...data,
        id: `clase-${Date.now()}`,
      };
      setClasses((prev) => [...prev, newClass]);
      showToast('Clase agregada.');
    }
  };

  const handleSaveTask = (data: Omit<CourseTask, 'id'>, editId?: string) => {
    if (editId) {
      setTasks((prev) =>
        prev.map((item) => (item.id === editId ? { ...data, id: editId } : item))
      );
      showToast('Tarea actualizada.');
    } else {
      const newTask: CourseTask = {
        ...data,
        id: `tarea-${Date.now()}`,
      };
      setTasks((prev) => [...prev, newTask]);
      showToast('Tarea agregada.');
    }
  };

  const handleQuickAddTask = (title: string, dueDate: string) => {
    const newTask: CourseTask = {
      id: `tarea-${Date.now()}`,
      title,
      description: 'Actividad agregada desde Inicio.',
      dueDate,
      module: 'Curso de Google AI Studio',
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Actividad agregada.');
  };

  const handleSaveNote = (data: Omit<CourseNote, 'id'>, editId?: string) => {
    if (editId) {
      setNotes((prev) =>
        prev.map((item) => (item.id === editId ? { ...data, id: editId } : item))
      );
      showToast('Nota actualizada.');
    } else {
      const newNote: CourseNote = {
        ...data,
        id: `nota-${Date.now()}`,
      };
      setNotes((prev) => [newNote, ...prev]);
      showToast('Nota guardada.');
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        showToast(
          nextCompleted ? 'Tarea marcada como completada.' : 'Tarea marcada como pendiente.'
        );
        return { ...t, completed: nextCompleted };
      })
    );
  };

  const handleConfirmDelete = (
    entityType: 'clase' | 'tarea' | 'nota',
    id: string
  ) => {
    if (entityType === 'clase') {
      setClasses((prev) => prev.filter((item) => item.id !== id));
      showToast('Clase eliminada.');
    } else if (entityType === 'tarea') {
      setTasks((prev) => prev.filter((item) => item.id !== id));
      showToast('Tarea eliminada.');
    } else {
      setNotes((prev) => prev.filter((item) => item.id !== id));
      showToast('Nota eliminada.');
    }
  };

  const handleConfirmReset = () => {
    setClasses(getInitialClasses());
    setTasks(getInitialTasks());
    setNotes(getInitialNotes());
    showToast('Datos de ejemplo restaurados.');
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh bg-[#F6F8FB] text-slate-900 flex flex-col lg:flex-row">
      {/* Barra lateral en pantallas grandes (escritorio) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-dvh bg-white border-r border-slate-200 p-5">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Mi Agenda de Aprendizaje
            </h1>
            <p className="text-xs text-slate-500">Curso Google AI Studio</p>
          </div>
        </div>

        <nav className="mt-5 space-y-1.5 flex-1" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Cabecera móvil compacta (no fija para dejar >90% de pantalla libre) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 leading-tight truncate">
                Mi Agenda de Aprendizaje
              </h1>
              <p className="text-xs text-slate-500 truncate">
                Curso de Google AI Studio
              </p>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-10">
          {activeTab === 'inicio' && (
            <InicioView
              classes={classes}
              tasks={tasks}
              onNavigate={handleSelectTab}
              onAddClass={() => setModal({ type: 'class-form', mode: 'create' })}
              onEditClass={(item) =>
                setModal({ type: 'class-form', mode: 'edit', item })
              }
              onDeleteClass={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'clase',
                  id: item.id,
                  title: item.title,
                })
              }
              onAddTask={() => setModal({ type: 'task-form', mode: 'create' })}
              onQuickAddTask={handleQuickAddTask}
              onEditTask={(item) =>
                setModal({ type: 'task-form', mode: 'edit', item })
              }
              onDeleteTask={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'tarea',
                  id: item.id,
                  title: item.title,
                })
              }
              onToggleTask={handleToggleTask}
              onAddNote={() => setModal({ type: 'note-form', mode: 'create' })}
            />
          )}

          {activeTab === 'calendario' && (
            <CalendarioView
              classes={classes}
              tasks={tasks}
              onAddClass={(defaultDate) =>
                setModal({ type: 'class-form', mode: 'create', defaultDate })
              }
              onEditClass={(item) =>
                setModal({ type: 'class-form', mode: 'edit', item })
              }
              onDeleteClass={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'clase',
                  id: item.id,
                  title: item.title,
                })
              }
              onAddTask={(defaultDate) =>
                setModal({ type: 'task-form', mode: 'create', defaultDate })
              }
              onEditTask={(item) =>
                setModal({ type: 'task-form', mode: 'edit', item })
              }
              onDeleteTask={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'tarea',
                  id: item.id,
                  title: item.title,
                })
              }
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'tareas' && (
            <TareasView
              tasks={tasks}
              onAddTask={() => setModal({ type: 'task-form', mode: 'create' })}
              onEditTask={(item) =>
                setModal({ type: 'task-form', mode: 'edit', item })
              }
              onDeleteTask={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'tarea',
                  id: item.id,
                  title: item.title,
                })
              }
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'notas' && (
            <NotasView
              notes={notes}
              onAddNote={() => setModal({ type: 'note-form', mode: 'create' })}
              onEditNote={(item) =>
                setModal({ type: 'note-form', mode: 'edit', item })
              }
              onDeleteNote={(item) =>
                setModal({
                  type: 'confirm-delete',
                  entityType: 'nota',
                  id: item.id,
                  title: item.title,
                })
              }
            />
          )}

          {activeTab === 'progreso' && (
            <ProgresoView
              classes={classes}
              tasks={tasks}
              notes={notes}
              onToggleTask={handleToggleTask}
              onNavigate={handleSelectTab}
              onRequestReset={() => setModal({ type: 'confirm-reset' })}
            />
          )}
        </main>
      </div>

      {/* Barra inferior de navegación fija en móviles */}
      <nav
        aria-label="Menú inferior"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-5 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive
                    ? 'text-blue-700 font-bold'
                    : 'text-slate-600 font-medium hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[11px] leading-tight whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Aviso breve de confirmación de acciones */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}

      {/* Ventana modal para crear, editar o confirmar eliminación */}
      <AgendaModal
        modal={modal}
        onClose={() => setModal({ type: 'closed' })}
        onSaveClass={handleSaveClass}
        onSaveTask={handleSaveTask}
        onSaveNote={handleSaveNote}
        onConfirmDelete={handleConfirmDelete}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
