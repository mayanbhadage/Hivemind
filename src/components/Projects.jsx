import { useState } from 'react';

const projects = [
    {
        title: 'Project One',
        description: 'A brief description of the project and the technologies used.',
        tags: ['React', 'Node.js', 'MongoDB'],
        link: '#'
    },
    {
        title: 'Project Two',
        description: 'Another amazing project showcasing creative solutions.',
        tags: ['Vue', 'Firebase', 'Tailwind'],
        link: '#'
    },
    {
        title: 'Project Three',
        description: 'A mobile-first application with a focus on UX.',
        tags: ['React Native', 'Expo'],
        link: '#'
    }
];

const ProjectCard = ({ project }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: 'var(--bg-color)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
            }}
        >
            <h3 style={{ marginBottom: '1rem', transform: 'translateZ(20px)' }}>{project.title}</h3>
            <p style={{ marginBottom: '1.5rem', color: '#6b7280', transform: 'translateZ(10px)' }}>{project.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', transform: 'translateZ(10px)' }}>
                {project.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--secondary-bg)',
                        borderRadius: '1rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>
            <a href={project.link} style={{ fontWeight: '600', display: 'inline-block', transform: 'translateZ(20px)' }}>View Project &rarr;</a>
        </div>
    );
};

export default function Projects() {
    return (
        <section id="projects" style={{ backgroundColor: 'rgba(var(--secondary-bg-rgb), 0.5)', backdropFilter: 'blur(10px)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Featured Projects</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
