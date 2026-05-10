'use client';

/* Animated gradient mesh — fixed behind everything.
   5 blobs with independent paths, a grain overlay for depth. */
export default function MeshBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Base */}
      <div className="mesh-base" />

      {/* Blob 1 — large teal, slow drift */}
      <div className="mesh-blob mesh-b1" />
      {/* Blob 2 — smaller teal, faster */}
      <div className="mesh-blob mesh-b2" />
      {/* Blob 3 — deep green, bottom */}
      <div className="mesh-blob mesh-b3" />
      {/* Blob 4 — warm gold, subtle */}
      <div className="mesh-blob mesh-b4" />
      {/* Blob 5 — teal, top right */}
      <div className="mesh-blob mesh-b5" />

      {/* Grain texture */}
      <div className="mesh-grain" />

      {/* Vignette */}
      <div className="mesh-vignette" />

    </div>
  );
}
