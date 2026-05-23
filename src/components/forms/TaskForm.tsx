import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskFormData } from '../../validators/task.validators';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { TaskPriority } from '../../types/task.types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface TaskFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const TaskForm = ({ onSuccess, onError }: TaskFormProps) => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { createTask, isLoading, error, clearError } = useTasks();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: projects[0]?.id,
      priority: TaskPriority.MEDIUM,
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      setSubmitError(null);
      clearError();
      if (!user?.id) throw new Error('Usuario no autenticado');
      await createTask(user.id, data);
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear tarea';
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
        label="Nombre de la Tarea"
        placeholder="Mi nueva tarea"
        {...register('name')}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Descripción (Opcional)
        </label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe tu tarea..."
          {...register('description')}
        />
      </div>

      <Select
        label="Proyecto"
        options={projects.map((p) => ({ value: p.id, label: p.name }))}
        {...register('projectId')}
        error={errors.projectId?.message}
      />

      <Select
        label="Prioridad"
        options={[
          { value: TaskPriority.LOW, label: 'Baja' },
          { value: TaskPriority.MEDIUM, label: 'Media' },
          { value: TaskPriority.HIGH, label: 'Alta' },
        ]}
        {...register('priority')}
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;