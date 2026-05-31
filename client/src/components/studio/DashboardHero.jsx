import React from "react";
import { Frame, Github, Palette, Download } from "lucide-react";

const WORKFLOW_STEPS = [
  { label: "1. Username", icon: Github },
  { label: "2. Style", icon: Palette },
  { label: "3. Export", icon: Download },
];

function DashboardHero({ colors, themesCount, selectedTheme, size }) {
  return (
    <section
      className="dashboard-hero studio-dashboard-hero"
      data-aos="fade-down"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        color: colors.textPrimary,
      }}
    >
      <div className="dashboard-hero__mark" aria-hidden="true">
        <Frame size={30} strokeWidth={2.4} />
      </div>

      <div className="dashboard-hero__content">
        <p className="dashboard-eyebrow">Avatar Frame Studio</p>
        <h1 className="dashboard-title">GitAvatar Frame Creator</h1>
        <p className="dashboard-subtitle">Design, preview, and export in one flow.</p>
      </div>

      <div className="studio-workflow" aria-label="Avatar creation workflow">
        {WORKFLOW_STEPS.map(({ label, icon }, index) => (
          <div className="studio-workflow__step" key={label}>
            <span className="studio-workflow__icon">
              {React.createElement(icon, { size: 15 })}
            </span>
            <span>{label}</span>
            {index < WORKFLOW_STEPS.length - 1 && <span className="studio-workflow__line" />}
          </div>
        ))}
      </div>

      <div className="dashboard-hero__meta" aria-label="Dashboard summary">
        <span>{themesCount || "—"} themes</span>
        <span>{size}px canvas</span>
        <span>{selectedTheme}</span>
      </div>
    </section>
  );
}

export default DashboardHero;
