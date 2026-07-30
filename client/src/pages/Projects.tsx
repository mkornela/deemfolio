import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <section data-section="projects" className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTag className="mb-3">PRODUCTION_LOG</SectionTag>
          <h1 className="mb-3 font-display text-4xl font-black text-white sm:text-5xl">
            All <span className="text-gradient">Projects</span>
          </h1>
          <p className="mb-10 max-w-2xl text-sm text-muted">
            Real-time services, APIs, and streaming tools. Each unit has its own detail page with architecture, stack, and links.
          </p>
        </Reveal>

        <Stagger className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {projects.map((project) => (
            <StaggerItem key={project.slug} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
