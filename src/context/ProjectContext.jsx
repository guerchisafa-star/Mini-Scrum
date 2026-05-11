import { createContext, useContext, useState, useEffect } from 'react';
import { projects as projectsApi } from '../api/client';
import { useAuth } from './AuthContext';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjectList(data);
      if (data.length > 0 && !currentProject) {
        setCurrentProject(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  return (
    <ProjectContext.Provider value={{ projectList, currentProject, setCurrentProject, loadProjects, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
