import { projects } from "@/content/projects";
import { ProjectsTrack } from "@/components/ui/ProjectsTrack";

export function Projects() {
  return (
    <section id="projects" data-scene="projects" aria-labelledby="projects-title" className="relative z-10 bg-paper text-ink">
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 text-ink/[0.06]" />
      <ProjectsTrack projects={projects} />
    </section>
  );
}
