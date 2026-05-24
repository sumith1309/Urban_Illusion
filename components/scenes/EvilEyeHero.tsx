import { EyePoster } from "@/components/scenes/EyePoster";

/* Hero stage — vector poster only.
   The WebGL "living eye" crossfade was removed (2026-05-24): the rectangular
   canvas was visibly composited over the SVG poster, the rings didn't match
   the poster's eye position, and the overall effect read as unprofessional
   rather than premium. The LivingEye R3F component (components/scenes/LivingEye.tsx)
   and the shader source (shaders/eye.glsl) remain in the repo for a future
   revisit if and only if we can land it as a precise pixel match of the poster
   with no visible canvas edges — otherwise the static SVG is the canonical
   render, full stop.

   Benefits of removal: no ~230 KB WebGL chunk, no first-input load latency,
   simpler INP profile, and the hero reads as the master logo intended. */

export function EvilEyeHero({ className }: { className?: string }) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ aspectRatio: "5 / 6" }}
    >
      <EyePoster className="absolute inset-0 w-full h-full" />
    </div>
  );
}
