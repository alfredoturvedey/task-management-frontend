// src/components/projects/ProjectList.tsx
import { ProjectListItem } from "./ProjectListItem";
import type { Project } from "../../types/project.types";

interface ProjectListProps {
  projects: Project[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
  onManageMembers: (projectId: string) => void;
}

export const ProjectList = ({
  projects,
  pagination,
  onPageChange,
  onLimitChange,
  isLoading = false,
  onViewTasks,
  onEdit,
  onDelete,
  onAddTask,
  onManageMembers,
}: ProjectListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cargando proyectos...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay proyectos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Nombre
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Descripción
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                ID
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Fecha Creación
              </th>
              <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onViewTasks={onViewTasks}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddTask={onAddTask}
                onManageMembers={onManageMembers}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mostrar
          </span>
          <select
            value={pagination.itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            por página
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Página {pagination.currentPage} de {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === (pagination.totalPages || 1)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
