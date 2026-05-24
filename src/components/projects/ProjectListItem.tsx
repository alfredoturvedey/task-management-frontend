// src/components/projects/ProjectListItem.tsx
import { Edit2, Eye, ListPlus, Trash2, Users } from "lucide-react";
import IconActionButton from "../common/IconActionButton";
import type { Project } from "../../types/project.types";
import { formatOptionalText } from "../../utils/displayText";

interface ProjectListItemProps {
  project: Project;
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
  onManageMembers: (projectId: string) => void;
}

export const ProjectListItem = ({
  project,
  onViewTasks,
  onEdit,
  onDelete,
  onAddTask,
  onManageMembers,
}: ProjectListItemProps) => {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
      <td className="p-4 text-gray-900 dark:text-white">{project.name}</td>
      <td className="p-4 text-gray-500 dark:text-gray-400">
        {formatOptionalText(project.description, "Sin descripcion")}
      </td>
      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {project.id}
      </td>
      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(project.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-1">
          <IconActionButton
            label="Editar"
            variant="primary"
            onClick={() => onEdit(project)}
          >
            <Edit2 className="h-4 w-4" />
          </IconActionButton>
          <IconActionButton
            label="Eliminar"
            variant="destructive"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconActionButton>
          <IconActionButton
            label="Ver tareas"
            variant="success"
            onClick={() => onViewTasks(project.id)}
          >
            <Eye className="h-4 w-4" />
          </IconActionButton>
          <IconActionButton
            label="Agregar tarea"
            variant="default"
            onClick={() => onAddTask(project.id)}
          >
            <ListPlus className="h-4 w-4" />
          </IconActionButton>
          <IconActionButton
            label="Miembros"
            variant="warning"
            onClick={() => onManageMembers(project.id)}
          >
            <Users className="h-4 w-4" />
          </IconActionButton>
        </div>
      </td>
    </tr>
  );
};

