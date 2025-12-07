import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import HexagonBackground from './components/HexagonBackground';
import RevealOnScroll from './components/RevealOnScroll';

function App() {
  return (
    <div className="app">
      <HexagonBackground />
      <Navbar />
      <RevealOnScroll>
        <Hero />
      </RevealOnScroll>
      <RevealOnScroll delay={200}>
        <Projects />
      </RevealOnScroll>
      <RevealOnScroll delay={400}>
        <Contact />
      </RevealOnScroll>
      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ fontWeight: 'bold' }}>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
