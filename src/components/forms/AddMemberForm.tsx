import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { usersService } from "../../api/services/users.service";
import type { User } from "../../types/auth.types";
import type { Project } from "../../types/project.types";
import Select from "../common/Select";
import Button from "../common/Button";
import Alert from "../common/Alert";

const addMemberSchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberFormProps {
  project: Project;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const AddMemberForm = ({ project, onSuccess, onError }: AddMemberFormProps) => {
  const { user } = useAuth();
  const { addMember, isLoading, error, clearError } = useProjects();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
  });

  // Cargar todos los usuarios del sistema
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const users = await usersService.getAll();
        setAllUsers(users);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setSubmitError("No se pudieron cargar los usuarios disponibles");
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filtrar usuarios que no son miembros y no son el propietario
  const availableUsers = allUsers.filter(
    (u) => !project.members.some((m) => m.id === u.id) && u.id !== project.ownerId
  );

  const onSubmit = async (data: AddMemberFormData) => {
    clearError();
    setSubmitError(null);

    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      await addMember(user.id, project.id, { userId: data.userId });
      reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || "Error al agregar miembro";
      setSubmitError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const displayError = submitError || error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {displayError && (
        <Alert variant="destructive" onClose={() => setSubmitError(null)}>
          {displayError}
        </Alert>
      )}

      <div>
        <label htmlFor="userId" className="block text-sm font-medium mb-2">
          Seleccionar miembro
        </label>
        <Select
          id="userId"
          disabled={usersLoading || availableUsers.length === 0}
          options={[
            {
              value: "",
              label: usersLoading
                ? "Cargando usuarios..."
                : availableUsers.length === 0
                  ? "No hay usuarios disponibles"
                  : "Elige un usuario",
            },
            ...availableUsers.map((u) => ({
              value: u.id,
              label: `${u.name} (${u.email})`,
            })),
          ]}
          {...register("userId")}
        />
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading || usersLoading}>
        {isLoading ? "Agregando..." : "Agregar miembro"}
      </Button>
    </form>
  );
};

export default AddMemberForm;
