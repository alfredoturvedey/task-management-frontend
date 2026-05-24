// src/components/projects/ProjectListItem.tsx
import { Edit2, Eye, ListPlus, Trash2, Users } from "lucide-react";
import IconActionButton from "../common/IconActionButton";
import type { Project } from "../../types/project.types";
import { formatOptionalText } from "../../utils/displayText";

interface ProjectListItemProps {
  project: Project;
  currentUserId?: string;
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
  onManageMembers: (projectId: string) => void;
}

export const ProjectListItem = ({
  project,
  currentUserId,
  onViewTasks,
  onEdit,
  onDelete,
  onAddTask,
  onManageMembers,
}: ProjectListItemProps) => {
  const isOwner = project.ownerId === currentUserId;

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
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            project.archived
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {project.archived ? "Archivado" : "Activo"}
        </span>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-1">
          {isOwner && (
            <>
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
            </>
          )}
          <IconActionButton
            label="Ver tareas"
            variant="success"
            onClick={() => onViewTasks(project.id)}
          >
            <Eye className="h-4 w-4" />
          </IconActionButton>
          {!project.archived && (
            <IconActionButton
              label="Agregar tarea"
              variant="default"
              onClick={() => onAddTask(project.id)}
            >
              <ListPlus className="h-4 w-4" />
            </IconActionButton>
          )}
          {isOwner && (
            <IconActionButton
              label="Miembros"
              variant="warning"
              onClick={() => onManageMembers(project.id)}
            >
              <Users className="h-4 w-4" />
            </IconActionButton>
          )}
        </div>
      </td>
    </tr>
  );
};

