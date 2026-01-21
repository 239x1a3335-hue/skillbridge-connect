import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Github, ExternalLink, Folder, Code } from 'lucide-react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProjectsSectionProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  readonly?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects, 
  onUpdateProjects, 
  readonly = false 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    githubLink: '',
    deployedLink: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skills: '',
      githubLink: '',
      deployedLink: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Project name is required');
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s);

    const newProject: Project = {
      id: editingId || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      skills: skillsArray,
      githubLink: formData.githubLink.trim() || undefined,
      deployedLink: formData.deployedLink.trim() || undefined,
    };

    if (editingId) {
      const updated = projects.map(p => p.id === editingId ? newProject : p);
      onUpdateProjects(updated);
      toast.success('Project updated');
    } else {
      onUpdateProjects([...projects, newProject]);
      toast.success('Project added');
    }

    resetForm();
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      githubLink: project.githubLink || '',
      deployedLink: project.deployedLink || '',
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onUpdateProjects(projects.filter(p => p.id !== id));
    toast.success('Project removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Folder className="w-5 h-5 text-primary" />
          Projects
        </h3>
        {!readonly && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Project
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && !readonly && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-accent/30 rounded-xl space-y-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Project Name *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your project..."
              className="input-field min-h-[80px] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Technologies (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              className="input-field"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Link</label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deployed Link</label>
              <input
                type="url"
                value={formData.deployedLink}
                onChange={(e) => setFormData({ ...formData, deployedLink: e.target.value })}
                placeholder="https://myproject.com"
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              {editingId ? 'Update' : 'Add'} Project
            </Button>
          </div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {readonly ? 'No projects added yet.' : 'No projects yet. Add your first project!'}
          </p>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-accent/20 rounded-xl group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{project.title}</h4>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  {project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          <Code className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-3">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.deployedLink && (
                      <a
                        href={project.deployedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                {!readonly && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(project)}
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
