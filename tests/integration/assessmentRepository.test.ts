import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runAssessment } from "@/core/assessment/runAssessment";
import { InMemoryAssessmentRepository } from "@/core/memory/assessmentRepository";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("AssessmentRepository (in-memory)", () => {
  it("saves, gets, and lists a run round-trip", async () => {
    const repo = new InMemoryAssessmentRepository();
    const result = runAssessment({ rootDir, now, assessmentId: "ASM-TEST-1" });

    const saved = await repo.save(result);
    expect(saved.id).toBe("ASM-TEST-1");
    expect(saved.status).toBe("NOT_TRUSTED");

    const fetched = await repo.get("ASM-TEST-1");
    expect(fetched?.result.findings).toHaveLength(4);

    const list = await repo.list();
    expect(list.map((r) => r.id)).toContain("ASM-TEST-1");
  });

  it("returns null for an unknown id", async () => {
    const repo = new InMemoryAssessmentRepository();
    expect(await repo.get("nope")).toBeNull();
  });

  it("lists most recent first", async () => {
    const repo = new InMemoryAssessmentRepository();
    await repo.save(runAssessment({ rootDir, now: new Date("2026-09-14T00:00:00Z"), assessmentId: "ASM-OLD" }));
    await repo.save(runAssessment({ rootDir, now: new Date("2026-09-15T00:00:00Z"), assessmentId: "ASM-NEW" }));
    const list = await repo.list();
    expect(list[0]!.id).toBe("ASM-NEW");
  });
});
