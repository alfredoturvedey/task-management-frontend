// src/components/projects/ProjectListItem.tsx
import type { Project } from "../../types/project.types";

interface ProjectListItemProps {
  project: Project;
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
}

export const ProjectListItem = ({
  project,
  onViewTasks,
  onEdit,
  onDelete,
  onAddTask,
}: ProjectListItemProps) => {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
      <td className="p-4 text-gray-900 dark:text-white">{project.name}</td>
      <td className="p-4 text-gray-500 dark:text-gray-400">
        {project.description || "—"}
      </td>
      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {project.id}
      </td>
      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(project.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 text-right">
        <button
          onClick={() => onEdit(project)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mr-3"
        >
          Eliminar
        </button>
        <button
          onClick={() => onViewTasks(project.id)}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-3"
        >
          Ver tareas
        </button>
        <button
          onClick={() => onAddTask(project.id)}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Añadir tarea
        </button>
      </td>
    </tr>
  );
};
