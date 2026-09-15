import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runCustomerAssessment } from "@/core/customer/runCustomerAssessment";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("runCustomerAssessment — Customer Trust demo (integration)", () => {
  const result = runCustomerAssessment({ rootDir, now });

  it("assesses all customer-domain assets", () => {
    expect(result.totals.assets).toBe(6);
    expect(result.totals.columns).toBeGreaterThan(40);
  });

  it("produces a low, deterministic overall coverage (the wow number)", () => {
    expect(result.coverage.overall).toBeGreaterThan(0);
    expect(result.coverage.overall).toBeLessThan(0.5);
    expect(runCustomerAssessment({ rootDir, now }).coverage.overall).toBe(result.coverage.overall);
  });

  it("detects the email PII classification gap (identity story)", () => {
    const emailGap = result.gaps.find((g) => g.asset === "CUSTOMER" && g.column === "email");
    expect(emailGap?.pii_unclassified).toBe(true);
    expect(emailGap?.missing_description).toBe(true);
  });

  it("detects the marketing_consent description gap (consent story)", () => {
    const consentGap = result.gaps.find(
      (g) => g.asset === "CUSTOMER" && g.column === "marketing_consent",
    );
    expect(consentGap?.missing_description).toBe(true);
  });
});
