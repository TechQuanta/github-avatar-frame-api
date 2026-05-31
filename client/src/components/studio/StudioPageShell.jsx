import React from "react";

function StudioPageShell({ colors, children }) {
  return (
    <main
      className="studio-page"
      style={{
        background: colors.bgBody,
        color: colors.textPrimary,
      }}
    >
      <div className="layout-wrapper studio-page__layout">{children}</div>
    </main>
  );
}

export default StudioPageShell;
