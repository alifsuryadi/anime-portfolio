import { projects } from "@/content/projects";
import { ProjectsTrack } from "@/components/ui/ProjectsTrack";

export function Projects() {
  return (
    <section
      id="projects"
      data-scene="projects"
      aria-labelledby="projects-title"
      className="bg-paper text-ink relative z-10"
    >
      <div
        aria-hidden="true"
        className="halftone text-ink/[0.06] pointer-events-none absolute inset-0"
      />
      <ProjectsTrack
        projects={projects.filter((p) => p.featured !== false)}
        more={projects.filter((p) => p.featured === false)}
      />
    </section>
  );
}
