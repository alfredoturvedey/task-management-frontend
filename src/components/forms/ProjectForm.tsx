import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type CreateProjectFormData } from '../../validators/project.validators';
import { useProjects } from '../../hooks/useProjects';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '@/hooks/useAuth';
import { CreateProjectPayload } from '@/types/project.types';

interface ProjectFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ProjectForm = ({ onSuccess, onError }: ProjectFormProps) => {
  const { createProject, isLoading, error, clearError } = useProjects();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      setSubmitError(null);
      clearError();
      const payload: CreateProjectPayload = {
        name: data.name,
        description: data.description,
        userId: user?.id || ''
      };
      await createProject(payload);
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear proyecto";
      setSubmitError(message);
      onError?.(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(error || submitError) && (
        <Alert variant="destructive" onClose={clearError}>
          {error || submitError}
        </Alert>
      )}

      <Input
        label="Nombre del Proyecto"
        placeholder="Mi nuevo proyecto"
        {...register('name')}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Descripción (Opcional)
        </label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe tu proyecto..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm font-medium text-destructive mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;