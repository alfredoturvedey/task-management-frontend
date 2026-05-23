// src/pages/Dashboard/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth"; 
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { ProjectList } from "@/components/projects/ProjectList";
import { Pagination } from "@/components/common/Pagination";
import { PageSizeSelector } from "@/components/common/PageSizeSelector";
import Button from "@/components/common/Button"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog"; // si usas shadcn
import { Project } from "@/types/project.types";
import Loader from "@/components/common/Loader";
import MainLayout from "@/components/layout/MainLayout";
//import { ProjectForm } from "@/components/projects/ProjectForm"; // formulario de edición/creación
//import { TaskForm } from "../components/tasks/TaskForm"; // formulario de tarea

const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState<string | null>(null);

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

  const { fetchTasks } = useTasks(); // para recargar tareas después de añadir

  useEffect(() => {
    if (user?.id) {
      fetchProjects(
        user.id,
        projectPagination.currentPage,
        projectPagination.itemsPerPage,
      );
    }
  }, [user?.id, fetchProjects]); // fetchProjects se mantiene estable

  const handleEditProject = (project: Project) => {
    setEditProject(project);
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

  const handleViewTasks = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Cargar tareas con paginación (asumiendo que useTasks tiene fetchTasks)
    if (user?.id) {
      //fetchTasks(user.id, projectId, 1, 10);
    }
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
      <div className="container mx-auto py-8 space-y-10">
        {/* Sección de Proyectos */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Mis Proyectos</h2>
            <PageSizeSelector
              value={projectPagination.itemsPerPage}
              onChange={handleProjectLimitChange}
            />
          </div>

          {projectsLoading ? (
            <Loader />
          ) : projectsError ? (
            <div className="text-red-500">Error: {projectsError}</div>
          ) : (
            <>
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
            </>
          )}
        </section>

        {/* Modal de edición de proyecto */}
        {editProject && (
          <Dialog
            open={!!editProject}
            onOpenChange={() => setEditProject(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar proyecto</DialogTitle>
              </DialogHeader>
              {/* <ProjectForm
              initialData={editProject}
              onSubmit={async (data) => {
                // Llamar a updateProject del store
                await updateProject(editProject.id, data);
                setEditProject(null);
                // Refrescar lista
                if (user?.id)
                  fetchProjects(
                    user.id,
                    projectPagination.currentPage,
                    projectPagination.itemsPerPage,
                  );
              }}
              onCancel={() => setEditProject(null)}
            /> */}
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de añadir tarea */}
        {showAddTaskModal && (
          <Dialog
            open={!!showAddTaskModal}
            onOpenChange={() => setShowAddTaskModal(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir tarea al proyecto</DialogTitle>
              </DialogHeader>
              {/* <TaskForm
              projectId={showAddTaskModal}
              onSubmit={async (taskData) => {
                await addTask(showAddTaskModal, taskData);
                setShowAddTaskModal(null);
                // Si estamos viendo las tareas de ese proyecto, refrescar
                if (selectedProjectId === showAddTaskModal) {
                  fetchTasks(user?.id, selectedProjectId, 1, 10);
                }
              }}
              onCancel={() => setShowAddTaskModal(null)}
            /> */}
            </DialogContent>
          </Dialog>
        )}

        {/* Aquí iría la sección de lista de tareas (similar a proyectos, con su propia tabla) */}
        {selectedProjectId && (
          <section>{/* ... componente TaskList con paginación ... */}</section>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage
