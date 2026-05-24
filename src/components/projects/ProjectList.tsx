// src/components/projects/ProjectList.tsx
import { ProjectListItem } from "./ProjectListItem";
import type { Project } from "../../types/project.types";

interface ProjectListProps {
  projects: Project[];
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
}

export const ProjectList = ({
  projects,
  onViewTasks,
  onEdit,
  onDelete,
  onAddTask,
}: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay proyectos para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onViewTasks={onViewTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddTask={onAddTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
