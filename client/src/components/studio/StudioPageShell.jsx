import React from "react";

function StudioPageShell({ colors, isDark, children }) {
  return (
    <main
      className="studio-page"
      data-app-theme={isDark ? "dark" : "light"}
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
