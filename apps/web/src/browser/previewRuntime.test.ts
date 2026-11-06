import type { EnvironmentId, PreviewSessionSnapshot } from "@t3tools/contracts";
import { describe, expect, it, vi } from "vite-plus/test";

import * as previewStateStore from "~/previewStateStore";

import { alternatePreviewTarget } from "./previewRuntime";

const local = "local" as EnvironmentId;
const remote = "remote" as EnvironmentId;
const snapshot = (input: Partial<PreviewSessionSnapshot>) =>
  ({ runtime: "server", ...input }) as PreviewSessionSnapshot;

describe("alternatePreviewTarget", () => {
  it("toggles the primary environment between desktop and headless server rendering", () => {
    vi.spyOn(previewStateStore, "isPreviewSupportedInRuntime").mockReturnValue(true);

    expect(alternatePreviewTarget(local, local, true, snapshot({}))).toEqual({
      runtime: "server",
      headless: true,
    });
    expect(alternatePreviewTarget(local, local, true, snapshot({ headless: true }))).toEqual({
      runtime: "server",
    });
  });

  it("preserves desktop and server movement for a remote environment", () => {
    vi.spyOn(previewStateStore, "isPreviewSupportedInRuntime").mockReturnValue(true);

    expect(alternatePreviewTarget(remote, local, true, snapshot({ runtime: "desktop" }))).toEqual({
      runtime: "server",
    });
    expect(alternatePreviewTarget(remote, local, true, snapshot({ runtime: "server" }))).toEqual({
      runtime: "desktop",
    });
  });
});
