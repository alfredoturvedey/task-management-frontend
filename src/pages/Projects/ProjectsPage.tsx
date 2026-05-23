import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/common/Button";
//import ProjectCard from "../../components/features/ProjectCard";
//import Loader from "../../components/common/Loader";
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
import { Pagination } from "@/components/common/Pagination";

const ProjectsPage = () => {
  const { user } = useAuth();
  const {
    projects,
    isLoading: projectsLoading,
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
    //editingProject,
    setEditingProject,
  } = useUIStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
      null,
  );

  const [showAddTaskModal, setShowAddTaskModal] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user?.id]);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    openDialog("editProject");
  };

  const handleCloseEditDialog = () => {
    closeDialog("editProject");
    setEditingProject(null);
  };

  const handleSuccess = () => {
    closeDialog("newProject");
    if (user?.id) fetchProjects(user.id);
  };

  const handleEditSuccess = () => {
    handleCloseEditDialog();
    if (user?.id) fetchProjects(user.id);
  };

  const handleViewTasks = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Cargar tareas con paginación (asumiendo que useTasks tiene fetchTasks)
    if (user?.id) {
      //fetchTasks(user.id, projectId, 1, 10);
    }
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
    setShowAddTaskModal(projectId);
  };

  const handleProjectPageChange = (page: number) => {
    if (user?.id) {
      setProjectPage(page); // esto debe llamar a fetchProjects internamente (según tu store)
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
          onViewTasks={handleViewTasks}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onAddTask={handleAddTask}
        />

        <Pagination
          currentPage={projectPagination.currentPage}
          totalPages={projectPagination.totalPages}
          onPageChange={handleProjectPageChange}
          className="mt-4"
        />

        <div className="text-sm text-gray-500 mt-2 text-center">
          Mostrando {projects.length} de {projectPagination.totalItems}{" "}
          proyectos
        </div>
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
