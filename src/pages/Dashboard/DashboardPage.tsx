import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/Card';
import ProjectCard from '../../components/features/ProjectCard';
import TaskCard from '../../components/features/TaskCard';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useUIStore } from '../../store/uiStore';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '../../components/common/Dialog';
import ProjectForm from '../../components/forms/ProjectForm';
import TaskForm from '../../components/forms/TaskForm';

const DashboardPage = () => {
  const { user } = useAuth();
  const { projects, fetchProjects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { tasks,
    //fetchTasks,
    isLoading: tasksLoading } = useTasks();
  const { dialogOpen, openDialog, closeDialog } = useUIStore();

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
      //fetchTasks(user.id);
    }
  }, [user?.id]);

  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 3);

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.name}. Aquí está tu resumen de proyectos y tareas.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => openDialog('newProject')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
          <Button variant="outline" onClick={() => openDialog('newTask')}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {projectsError && (
          <Alert variant="destructive">{projectsError}</Alert>
        )}

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
            <CardDescription>Tus últimos proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Loader message="Cargando proyectos..." />
            ) : recentProjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No tienes proyectos aún. ¡Crea uno nuevo!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas Recientes</CardTitle>
            <CardDescription>Tus últimas tareas</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <Loader message="Cargando tareas..." />
            ) : recentTasks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No tienes tareas aún. ¡Crea una nueva!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Project Dialog */}
      <Dialog
        open={dialogOpen.newProject}
        onOpenChange={(open) => open ? openDialog('newProject') : closeDialog('newProject')}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa los detalles para crear un nuevo proyecto
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            onSuccess={() => {
              closeDialog('newProject');
              if (user?.id) fetchProjects(user.id);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog
        open={dialogOpen.newTask}
        onOpenChange={(open) => open ? openDialog('newTask') : closeDialog('newTask')}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogDescription>
              Completa los detalles para crear una nueva tarea
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSuccess={() => {
              closeDialog('newTask');
              //if (user?.id) fetchTasks(user.id);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DashboardPage;