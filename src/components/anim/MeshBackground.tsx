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
      <div style={{ position: 'absolute', inset: 0, background: '#06080a' }} />

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
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(6,8,10,0.85) 100%)',
      }} />

      <style>{`
        .mesh-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          will-change: transform;
        }
        .mesh-b1 {
          width: 900px; height: 700px;
          top: -15%; left: -10%;
          background: radial-gradient(circle, rgba(14,116,112,0.28) 0%, transparent 70%);
          animation: mblob1 18s ease-in-out infinite;
        }
        .mesh-b2 {
          width: 500px; height: 500px;
          top: 20%; right: 5%;
          background: radial-gradient(circle, rgba(14,116,112,0.22) 0%, transparent 70%);
          animation: mblob2 13s ease-in-out infinite;
        }
        .mesh-b3 {
          width: 700px; height: 600px;
          bottom: -10%; left: 20%;
          background: radial-gradient(circle, rgba(10,84,80,0.30) 0%, transparent 70%);
          animation: mblob3 22s ease-in-out infinite;
        }
        .mesh-b4 {
          width: 400px; height: 300px;
          top: 40%; left: 40%;
          background: radial-gradient(circle, rgba(180,145,80,0.10) 0%, transparent 70%);
          animation: mblob4 15s ease-in-out infinite;
        }
        .mesh-b5 {
          width: 600px; height: 500px;
          top: -5%; right: -10%;
          background: radial-gradient(circle, rgba(20,140,135,0.18) 0%, transparent 70%);
          animation: mblob5 20s ease-in-out infinite;
        }
        .mesh-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.55;
          mix-blend-mode: overlay;
        }

        @keyframes mblob1 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          33%      { transform: translate(18%,-12%) scale(1.12); }
          66%      { transform: translate(-8%,22%) scale(0.92); }
        }
        @keyframes mblob2 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          40%      { transform: translate(-25%,18%) scale(1.18); }
          80%      { transform: translate(12%,-22%) scale(0.88); }
        }
        @keyframes mblob3 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          25%      { transform: translate(-15%,-18%) scale(1.08); }
          60%      { transform: translate(22%,8%) scale(1.15); }
        }
        @keyframes mblob4 {
          0%,100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
          50%      { transform: translate(30%,-20%) scale(1.3) rotate(180deg); }
        }
        @keyframes mblob5 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          45%      { transform: translate(-20%,25%) scale(1.1); }
          75%      { transform: translate(10%,-10%) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
