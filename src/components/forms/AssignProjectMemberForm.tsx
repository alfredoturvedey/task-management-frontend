import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Loader2, UserPlus } from "lucide-react";
import { usersService } from "../../api/services/users.service";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import type { User } from "../../types/auth.types";
import type { Project } from "../../types/project.types";
import Alert from "../common/Alert";
import Button from "../common/Button";

interface AssignProjectMemberFormProps {
  project: Project;
  projectId: string;
  onAssigned?: () => void;
}

const getUserDisplayName = (user: User) =>
  [user.name, user.lastName].filter(Boolean).join(" ") || user.email;

const AssignProjectMemberForm = ({
  project,
  projectId,
  onAssigned,
}: AssignProjectMemberFormProps) => {
  const { user } = useAuth();
  const { addMember, isLoading, error, clearError } = useProjects();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const memberIds = useMemo(
    () => new Set((project.members ?? []).map((member) => member.id)),
    [project.members],
  );
  const resolvedProjectId = project.id || projectId;

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setUsersLoading(true);
      setLocalError(null);

      try {
        const systemUsers = await usersService.getAll();

        if (isMounted) {
          setUsers(systemUsers);
        }
      } catch (err) {
        if (isMounted) {
          setLocalError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los usuarios del sistema",
          );
        }
      } finally {
        if (isMounted) {
          setUsersLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    setLocalError(null);

    if (!user?.id) {
      setLocalError("Usuario no autenticado");
      return;
    }

    if (!selectedUserId) {
      setLocalError("Selecciona un usuario para asignarlo al proyecto");
      return;
    }

    if (!resolvedProjectId) {
      setLocalError("No se pudo identificar el proyecto seleccionado");
      return;
    }

    try {
      await addMember(user.id, resolvedProjectId, {
        userId: selectedUserId,
      });
      onAssigned?.();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Error al asignar miembro",
      );
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <Alert
          variant="destructive"
          onClose={() => {
            setLocalError(null);
            clearError();
          }}
        >
          {displayError}
        </Alert>
      )}

      <div className="rounded-md border border-input">
        {usersLoading ? (
          <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No hay usuarios disponibles en el sistema.
          </p>
        ) : (
          <div className="max-h-80 divide-y divide-input overflow-y-auto">
            {users.map((systemUser) => {
              const isOwner = systemUser.id === project.ownerId;
              const isMember = memberIds.has(systemUser.id);
              const disabled = isOwner || isMember;

              return (
                <label
                  key={systemUser.id}
                  className={`flex cursor-pointer items-start gap-3 p-3 transition ${
                    disabled
                      ? "cursor-not-allowed bg-muted/40 opacity-70"
                      : "hover:bg-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="project-member"
                    value={systemUser.id}
                    checked={selectedUserId === systemUser.id}
                    disabled={disabled}
                    onChange={() => setSelectedUserId(systemUser.id)}
                    className="mt-1"
                  />

                  <span className="flex-1">
                    <span className="block font-medium">
                      {getUserDisplayName(systemUser)}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {systemUser.email}
                    </span>
                  </span>

                  {isOwner && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Propietario
                    </span>
                  )}
                  {!isOwner && isMember && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      <Check className="h-3 w-3" />
                      Miembro
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!selectedUserId || usersLoading}
          isLoading={isLoading}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Asignar usuario
        </Button>
      </div>
    </form>
  );
};

export default AssignProjectMemberForm;
