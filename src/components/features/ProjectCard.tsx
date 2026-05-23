import { useState } from 'react';
import { Trash2, Edit2, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/Card';
import Button from '../common/Button';
import type { Project } from '../../types/project.types';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteProject, isLoading } = useProjects();
  const [deleting, setDeleting] = useState(false);

  const isOwner = project.ownerId === user?.id;

  const handleDelete = async () => {
    if (!user?.id) return;
    setDeleting(true);
    try {
      await deleteProject(user.id, project.id);
      onDelete?.(project);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description || 'Sin descripción'}</CardDescription>
          </div>
          {isOwner && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(project)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleting || isLoading}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {/* <span>{project.members.length} miembro(s)</span> */}
        </div>

        {project._count && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            <span>{project._count.tasks} tarea(s)</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {project.archived ? '📦 Archivado' : '✅ Activo'}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;