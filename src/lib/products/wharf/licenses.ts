export type LicenseFamily =
  | "permissive"
  | "weak-copyleft"
  | "strong-copyleft"
  | "network-copyleft"
  | "proprietary"
  | "unknown";

export type Compatibility =
  | "compatible"
  | "review"
  | "incompatible"
  | "unknown";

export interface LicenseMeta {
  spdx: string;
  family: LicenseFamily;
  commercialFriendly: boolean;
  notes: string;
}

export const LICENSE_DB: Record<string, LicenseMeta> = {
  MIT: {
    spdx: "MIT",
    family: "permissive",
    commercialFriendly: true,
    notes: "Permissive; retain copyright notice.",
  },
  ISC: {
    spdx: "ISC",
    family: "permissive",
    commercialFriendly: true,
    notes: "Functionally similar to MIT.",
  },
  "Apache-2.0": {
    spdx: "Apache-2.0",
    family: "permissive",
    commercialFriendly: true,
    notes: "Permissive with patent grant; notice required.",
  },
  "BSD-2-Clause": {
    spdx: "BSD-2-Clause",
    family: "permissive",
    commercialFriendly: true,
    notes: "Permissive; retain notice.",
  },
  "BSD-3-Clause": {
    spdx: "BSD-3-Clause",
    family: "permissive",
    commercialFriendly: true,
    notes: "Permissive; no endorsement clause.",
  },
  "0BSD": {
    spdx: "0BSD",
    family: "permissive",
    commercialFriendly: true,
    notes: "Public-domain equivalent; minimal obligations.",
  },
  Unlicense: {
    spdx: "Unlicense",
    family: "permissive",
    commercialFriendly: true,
    notes: "Public-domain dedication.",
  },
  "MPL-2.0": {
    spdx: "MPL-2.0",
    family: "weak-copyleft",
    commercialFriendly: true,
    notes: "File-level copyleft; modifications to MPL files must stay MPL.",
  },
  "LGPL-2.1": {
    spdx: "LGPL-2.1",
    family: "weak-copyleft",
    commercialFriendly: false,
    notes: "Library copyleft; dynamic linking often acceptable with review.",
  },
  "LGPL-3.0-only": {
    spdx: "LGPL-3.0-only",
    family: "weak-copyleft",
    commercialFriendly: false,
    notes: "Library copyleft; verify distribution model.",
  },
  "EPL-2.0": {
    spdx: "EPL-2.0",
    family: "weak-copyleft",
    commercialFriendly: true,
    notes: "Weak copyleft common in Eclipse ecosystem.",
  },
  "GPL-2.0-only": {
    spdx: "GPL-2.0-only",
    family: "strong-copyleft",
    commercialFriendly: false,
    notes: "Strong copyleft; distribution of combined work triggers obligations.",
  },
  "GPL-3.0-only": {
    spdx: "GPL-3.0-only",
    family: "strong-copyleft",
    commercialFriendly: false,
    notes: "Strong copyleft with anti-tivoization and patent terms.",
  },
  "AGPL-3.0-only": {
    spdx: "AGPL-3.0-only",
    family: "network-copyleft",
    commercialFriendly: false,
    notes: "Network copyleft; SaaS use can trigger source obligations.",
  },
  "SSPL-1.0": {
    spdx: "SSPL-1.0",
    family: "proprietary",
    commercialFriendly: false,
    notes: "Not OSI-approved for typical SaaS; treat as high commercial risk.",
  },
  "BUSL-1.1": {
    spdx: "BUSL-1.1",
    family: "proprietary",
    commercialFriendly: false,
    notes: "Source-available with delayed open; commercial use restricted.",
  },
  Proprietary: {
    spdx: "Proprietary",
    family: "proprietary",
    commercialFriendly: false,
    notes: "Requires commercial license review.",
  },
  UNKNOWN: {
    spdx: "UNKNOWN",
    family: "unknown",
    commercialFriendly: false,
    notes: "Unresolved license; treat as blocking until identified.",
  },
};

export function normalizeLicense(raw: string): string {
  const t = raw.trim();
  if (!t || t === "UNLICENSED" || t.toLowerCase() === "none") return "UNKNOWN";
  const aliases: Record<string, string> = {
    "Apache 2.0": "Apache-2.0",
    Apache2: "Apache-2.0",
    "GPL-2.0": "GPL-2.0-only",
    "GPL-3.0": "GPL-3.0-only",
    "AGPL-3.0": "AGPL-3.0-only",
    "LGPL-3.0": "LGPL-3.0-only",
    BSD: "BSD-3-Clause",
  };
  return aliases[t] ?? t;
}

export function resolveLicense(raw: string): LicenseMeta {
  const key = normalizeLicense(raw);
  return LICENSE_DB[key] ?? { ...LICENSE_DB.UNKNOWN, spdx: key, notes: `Unrecognized SPDX expression: ${key}` };
}

/** Heuristic matrix for product shipping under a chosen outbound license. */
export function compatibilityFor(
  dependency: LicenseMeta,
  productLicense: string,
): Compatibility {
  const product = resolveLicense(productLicense);
  if (dependency.family === "unknown") return "unknown";
  if (dependency.family === "proprietary") return "review";
  if (dependency.family === "network-copyleft") {
    return product.family === "network-copyleft" ? "review" : "incompatible";
  }
  if (dependency.family === "strong-copyleft") {
    if (product.family === "strong-copyleft" || product.family === "network-copyleft")
      return "review";
    return "incompatible";
  }
  if (dependency.family === "weak-copyleft") return "review";
  return "compatible";
}
