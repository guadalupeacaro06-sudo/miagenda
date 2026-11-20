export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export interface CourseClass {
  id: string;
  title: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: string;
  modality: string;
}

export interface CourseTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  module: string;
  completed: boolean;
}

export interface CourseNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export type ModalState =
  | { type: 'closed' }
  | { type: 'class-form'; mode: 'create' | 'edit'; item?: CourseClass; defaultDate?: string }
  | { type: 'task-form'; mode: 'create' | 'edit'; item?: CourseTask; defaultDate?: string }
  | { type: 'note-form'; mode: 'create' | 'edit'; item?: CourseNote }
  | {
      type: 'confirm-delete';
      entityType: 'clase' | 'tarea' | 'nota';
      id: string;
      title: string;
    }
  | { type: 'confirm-reset' };
