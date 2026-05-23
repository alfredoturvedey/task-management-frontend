import { useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/common/Button";
import ProjectCard from "../../components/features/ProjectCard";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import { useUIStore } from "../../store/uiStore";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "../../components/common/Dialog";
import ProjectForm from "../../components/forms/ProjectForm";

const ProjectsPage = () => {
  const { user } = useAuth();
  const { projects, fetchProjects, isLoading, error } = useProjects();
  const { dialogOpen, openDialog, closeDialog } = useUIStore();

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user?.id]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
            <p className="text-muted-foreground">
              Gestiona todos tus proyectos en un solo lugar
            </p>
          </div>
          <Button onClick={() => openDialog("newProject")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Error */}
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Projects Grid */}
        {isLoading ? (
          <Loader message="Cargando proyectos..." />
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No tienes proyectos aún
            </p>
            <Button onClick={() => openDialog("newProject")}>
              Crear tu primer proyecto
            </Button>
          </div>
        )}
      </div>

      {/* New Project Dialog */}
      <Dialog
        open={dialogOpen.newProject}
        onOpenChange={(open) =>
          open ? openDialog("newProject") : closeDialog("newProject")
        }
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
              closeDialog("newProject");
              if (user?.id) fetchProjects(user.id);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProjectsPage;
