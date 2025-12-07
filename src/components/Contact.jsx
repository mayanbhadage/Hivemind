import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact() {
    const socialLinks = [
        { icon: <Mail size={24} />, label: 'Email', href: 'mailto:hello@example.com' },
        { icon: <Github size={24} />, label: 'GitHub', href: 'https://github.com' },
        { icon: <Linkedin size={24} />, label: 'LinkedIn', href: 'https://linkedin.com' },
        { icon: <Twitter size={24} />, label: 'Twitter', href: 'https://twitter.com' }
    ];

    return (
        <section id="contact" style={{ padding: '6rem 0', textAlign: 'center' }}>
            <div className="container">
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Get In Touch</h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-color)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    color: 'var(--text-color)',
                                    transition: 'transform 0.2s, color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.color = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--text-color)';
                                }}
                            >
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--secondary-bg)',
                                    borderRadius: '50%',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {link.icon}
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{link.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
