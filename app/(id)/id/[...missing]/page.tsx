import { notFound } from "next/navigation";

/** Catch-all so unknown URLs render this locale's styled 404 inside its root layout. */
export default function Missing() {
  notFound();
}
