import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    return (
        <nav style={{
            padding: '1.5rem 0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-color)',
            zIndex: 100,
            borderBottom: '1px solid var(--border-color)',
            transition: 'background-color 0.3s, border-color 0.3s'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <a href="#" className="logo">
                    M
                </a>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#projects" className="nav-link">Projects</a>
                    <a href="#contact" className="nav-link">Contact</a>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
