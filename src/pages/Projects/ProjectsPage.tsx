import { useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/common/Button";
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
import { ProjectList } from "@/components/projects/ProjectList";
import { Project } from "@/types/project.types";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    projects,
    error: projectsError,
    pagination: projectPagination = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
    fetchProjects,
    setPage: setProjectPage,
    setLimit: setProjectLimit,
    deleteProject,
  } = useProjects();
  const {
    dialogOpen,
    openDialog,
    closeDialog,
    editingProject,
    setEditingProject,
  } = useUIStore();

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user?.id]);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    openDialog("editProject");
  };

  const handleViewTasks = (projectId: string) => {
    navigate(`/tasks/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (
      window.confirm(
        "¿Eliminar este proyecto? Se perderán todas las tareas asociadas.",
      )
    ) {
      if (user?.id) {
        await deleteProject(user.id, projectId);
        // Recargar la página actual

        fetchProjects(
          user.id,
          projectPagination.currentPage,
          projectPagination.itemsPerPage,
        );
      }
    }
  };

  const handleAddTask = (projectId: string) => {
    //setShowAddTaskModal(projectId);
    navigate(`/tasks/${projectId}`);
  };

  const handleProjectPageChange = (page: number) => {
    if (user?.id) {
      setProjectPage(page); // esto debe llamar a fetchProjects internamente (según tu store)
    }
  };

  const handleProjectLimitChange = (limit: number) => {
    if (user?.id) {
      setProjectLimit(limit);
    }
  };

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
        {projectsError && <Alert variant="destructive">{projectsError}</Alert>}

        <ProjectList
          projects={projects}
          pagination={projectPagination}
          onPageChange={handleProjectPageChange}
          onLimitChange={handleProjectLimitChange}
          onViewTasks={handleViewTasks}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onAddTask={handleAddTask}
        />
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

      {/* Edit Project Dialog */}
      <Dialog
        open={dialogOpen.editProject}
        onOpenChange={(open) =>
          open ? openDialog("editProject") : closeDialog("editProject")
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proyecto</DialogTitle>
            <DialogDescription>
              Actualiza los detalles del proyecto
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSuccess={() => {
              closeDialog("editProject");
              setEditingProject(null);
              if (user?.id) fetchProjects(user.id);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProjectsPage;
