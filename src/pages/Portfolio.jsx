import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaMobile, FaServer, FaDatabase } from 'react-icons/fa';
import './Portfolio.css';

function Portfolio() {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'StudyNep – Smart Study Planner',
      category: 'web',
      description: 'Full-stack MERN application with adaptive scheduling, progress tracking, focus timer, and quiz system.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      icon: <FaCode />,
      image: '📚',
      github: 'https://github.com/yourusername/studynep',
      demo: '#'
    },
    {
      id: 2,
      title: 'E-Learning Platform',
      category: 'web',
      description: 'Online learning platform with video lectures, quizzes, and certification system.',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      icon: <FaCode />,
      image: '🎓',
      github: 'https://github.com/yourusername/elearning',
      demo: '#'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      category: 'design',
      description: 'Modern portfolio website with dark mode, animations, and responsive design.',
      technologies: ['React', 'Framer Motion', 'CSS3'],
      icon: <FaMobile />,
      image: '💼',
      github: 'https://github.com/yourusername/portfolio',
      demo: '#'
    },
    {
      id: 4,
      title: 'Task Manager API',
      category: 'backend',
      description: 'RESTful API for task management with JWT authentication and role-based access.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      icon: <FaServer />,
      image: '📋',
      github: 'https://github.com/yourusername/taskmanager',
      demo: '#'
    },
    {
      id: 5,
      title: 'Weather App',
      category: 'web',
      description: 'Real-time weather application with search and location-based forecasts.',
      technologies: ['React', 'OpenWeather API', 'Axios'],
      icon: <FaCode />,
      image: '🌤️',
      github: 'https://github.com/yourusername/weatherapp',
      demo: '#'
    },
    {
      id: 6,
      title: 'Database Design Tool',
      category: 'backend',
      description: 'Visual database schema designer with export functionality.',
      technologies: ['Python', 'Flask', 'PostgreSQL'],
      icon: <FaDatabase />,
      image: '🗄️',
      github: 'https://github.com/yourusername/dbdesigner',
      demo: '#'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', icon: '🔍' },
    { id: 'web', name: 'Web Development', icon: '🌐' },
    { id: 'backend', name: 'Backend', icon: '⚙️' },
    { id: 'design', name: 'UI/UX Design', icon: '🎨' },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <h1>My Portfolio</h1>
        <p>Showcasing my work and projects</p>
      </section>

      {/* Filter Section */}
      <div className="portfolio-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            <span className="filter-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image">{project.image}</div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                  <FaGithub /> Code
                </a>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link demo">
                  <FaExternalLinkAlt /> Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <section className="skills-section">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>React.js</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>Python</li>
              <li>Django</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Database</h3>
            <ul>
              <li>MongoDB</li>
              <li>PostgreSQL</li>
              <li>MySQL</li>
              <li>Firebase</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Tools & Others</h3>
            <ul>
              <li>Git & GitHub</li>
              <li>Docker</li>
              <li>REST APIs</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;