import { useState } from "react";
import type { Project } from "../../types/project.types";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import Alert from "../common/Alert";
import AddMemberForm from "./AddMemberForm";

interface ProjectMembersProps {
  project: Project;
  onMemberAdded?: () => void;
}

const ProjectMembers = ({ project, onMemberAdded }: ProjectMembersProps) => {
  const { user } = useAuth();
  const { removeMember, isLoading, error: storeError } = useProjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const isOwner = user?.id === project.ownerId;

  const handleRemoveMember = async (memberId: string) => {
    if (!user) return;

    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este miembro del proyecto?"
      )
    ) {
      return;
    }

    setDeleteError(null);
    try {
      await removeMember(user.id, project.id, memberId);
    } catch (err) {
      setDeleteError((err as Error)?.message || "Error al eliminar miembro");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Miembros del proyecto</h3>
        {isOwner && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2"
          >
            {showAddForm ? "Cancelar" : "Agregar miembro"}
          </Button>
        )}
      </div>

      {storeError && (
        <Alert variant="destructive" onClose={() => {}}>
          {storeError}
        </Alert>
      )}

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      {showAddForm && isOwner && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <AddMemberForm
            project={project}
            onSuccess={() => {
              setShowAddForm(false);
              onMemberAdded?.();
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {project.members && project.members.length > 0 ? (
          project.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
                {member.id === project.ownerId && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Propietario
                  </span>
                )}
              </div>
              {isOwner && member.id !== project.ownerId && (
                <Button
                  variant="outline"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isLoading}
                  className="ml-4 px-3 py-1 text-sm"
                >
                  {isLoading ? "..." : "Eliminar"}
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No hay miembros en este proyecto
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectMembers;
