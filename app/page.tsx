import Hero from './components/Hero';
import VelocityStrip from './components/VelocityStrip';
import About from './components/About';
import Services from './components/Services';
import Why from './components/Why';
import Skills from './components/Skills';
import Work from './components/Work';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SceneClient from './components/SceneClient';

export default function Page() {
  return (
    <main className="relative">
      <SceneClient />
      <Hero />
      <VelocityStrip />
      <About />
      <Services />
      <Why />
      <Skills />
      <Work />
      <Experience />
      <Contact />
    </main>
  );
}
