import * as React from "react";

// Create a mock component factory
const createMockIcon = (name) =>
  React.forwardRef((props, ref) =>
    React.createElement("svg", {
      ...props,
      ref,
      "data-testid": `lucide-${name}`,
      "aria-hidden": "true",
    })
  );

// Mock each icon we use
export const SkipBack = createMockIcon("skip-back");
export const SkipForward = createMockIcon("skip-forward");
export const Rewind = createMockIcon("rewind");
export const FastForward = createMockIcon("fast-forward");
