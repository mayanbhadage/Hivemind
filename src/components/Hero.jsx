import { useState, useEffect } from 'react';
import profileImg from '../assets/profile.jpg';

const useTypewriter = (text, speed = 100, delay = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setCurrentIndex(prev => (prev + 1) % text.length);
      }
    } else {
      const currentWord = text[currentIndex];
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, text, speed, delay]);

  return displayText;
};

export default function Hero() {
  const roles = ["Web Apps", "Experiences", "The Future"];
  const typingText = useTypewriter(roles);

  return (
    <section id="about" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="glass-panel" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          padding: '3rem'
        }}>
          {/* Text Content */}
          <div>
            <h1 style={{ marginBottom: '1.5rem', minHeight: '3.6em' }}>
              Hi, I'm <span style={{ color: 'var(--accent-color)' }}>Mayan</span>.<br />
              I build <span style={{ color: 'var(--text-color)' }}>{typingText}</span>
              <span className="cursor">|</span>
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              Currently shipping features as an <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Software Engineer 2 at Microsoft</span>.
              I tackle problems with O(n) complexity and O(1) excuses.
              Armed with a Master's & Bachelor's in CS and a license to push to production.
            </p>
            <a href="#projects" style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              View My Work
            </a>
          </div>

          {/* Image Content */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '300px',
                height: '350px', // Rectangular portrait
                borderRadius: '12px', // Slight rounding for aesthetics
                backgroundColor: 'var(--secondary-bg)',
                backgroundImage: `url(${profileImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
