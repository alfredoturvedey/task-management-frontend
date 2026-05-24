import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import MainLayout from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import ProjectMembers from "../../components/forms/ProjectMembers";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedProject, fetchProjectById, isLoading, error, clearError } =
    useProjects();

  useEffect(() => {
    if (!id) {
      navigate("/projects");
      return;
    }

    const loadProject = async () => {
      try {
        await fetchProjectById(id);
      } catch (err) {
        console.error("Error cargando proyecto:", err);
      }
    };

    loadProject();
  }, [id, fetchProjectById, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  if (!selectedProject) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Alert variant="destructive" onClose={() => navigate("/projects")}>
            {error || "Proyecto no encontrado"}
          </Alert>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            Volver a proyectos
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isOwner = user?.id === selectedProject.ownerId;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/projects")}
            variant="outline"
            className="mb-4"
          >
            ← Volver a proyectos
          </Button>
          <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
          <p className="text-gray-600">{selectedProject.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Propietario:{" "}
            <span className="font-medium">{selectedProject.owner.name}</span>
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Información del proyecto
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Estado</p>
                <p className="font-medium">
                  {selectedProject.archived ? "Archivado" : "Activo"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Miembros</p>
                <p className="font-medium">
                  {selectedProject.members?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tareas</p>
                <p className="font-medium">
                  {selectedProject._count?.tasks || 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Members */}
          <Card className="p-6">
            <ProjectMembers project={selectedProject} />
          </Card>
        </div>

        {/* Actions */}
        {isOwner && (
          <Card className="p-6 border-yellow-200 bg-yellow-50 mt-6">
            <h3 className="text-lg font-semibold mb-4">Acciones</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => navigate(`/projects/${selectedProject.id}/edit`)}
              >
                Editar proyecto
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
              >
                Eliminar proyecto
              </Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectDetailPage;
