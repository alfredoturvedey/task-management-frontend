// src/components/projects/ProjectListItem.tsx
import Button from "../common/Button"; 
import { Edit, Trash2, Eye, PlusCircle } from "lucide-react";
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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
        {project.name}
      </td>
      <td className="px-6 py-4 text-gray-500">{project.description || "—"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(project.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(project)}
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(project.id)}
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewTasks(project.id)}
          title="Ver tareas"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(project.id)}
          title="Añadir tarea"
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};
