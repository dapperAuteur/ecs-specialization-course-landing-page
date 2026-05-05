import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = 'ECS Specialization: endocannabinoid system science education';

/**
 * Placeholder OG image. Programmatically rendered text on emerald gradient.
 * BAM swaps this for real brand art post-launch by replacing this file with
 * a static 1200×630 PNG at app/opengraph-image.png (Next 16 will pick that
 * up automatically, no code change).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
          padding: '80px',
          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#6ee7b7',
            marginBottom: 24,
          }}
        >
          ECS SPECIALIZATION
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 28,
            maxWidth: 1000,
          }}
        >
          The science of the endocannabinoid system.
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#a7f3d0',
            maxWidth: 950,
            lineHeight: 1.3,
          }}
        >
          Receptor biology, endogenous ligands, and signaling. 40+ years of research, taught as a specialization.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 22,
            color: '#d1fae5',
            opacity: 0.85,
          }}
        >
          ecs-specialization.betterbud.club
        </div>
      </div>
    ),
    { ...size },
  );
}
