import { useState } from 'react';
import { FilePlus2, Pencil, Search, Trash2, X } from 'lucide-react';
import { CourseNote } from '../types/agenda';
import { formatShortDate } from '../utils/dateUtils';

interface NotasViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (item: CourseNote) => void;
  onDeleteNote: (item: CourseNote) => void;
}

export function NotasView({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: NotasViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredNotes = [...notes]
    .filter((note) => {
      if (!normalizedQuery) return true;
      return (
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.topic.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-5">
      {/* Cabecera y buscador */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Notas y apuntes
            </h2>
            <p className="text-sm text-slate-600 tabular-nums">
              {notes.length} {notes.length === 1 ? 'apunte guardado' : 'apuntes guardados'} sobre Google AI Studio
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <FilePlus2 className="w-5 h-5 shrink-0" />
            <span>Crear nueva nota</span>
          </button>
        </div>

        {/* Buscador simple */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar apuntes por tema o palabra clave..."
            aria-label="Buscar apuntes"
            className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
      </div>

      {/* Lista de notas */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            {searchTerm
              ? 'No se encontraron notas con ese término.'
              : 'Aún no tienes apuntes guardados.'}
          </p>
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50"
            >
              Mostrar todas las notas
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddNote}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base inline-flex items-center gap-2 hover:bg-blue-800"
            >
              <FilePlus2 className="w-5 h-5" />
              <span>Crear nueva nota</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((nota) => (
            <article
              key={nota.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-blue-800">{nota.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Actualizado: {formatShortDate(nota.updatedAt)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {nota.title}
                </h3>
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {nota.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEditNote(nota)}
                  className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(nota)}
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
