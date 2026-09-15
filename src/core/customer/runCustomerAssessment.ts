import {
  runDomainAssessment,
  type DomainAssessmentResult,
} from "@/core/domain-pack/runDomainAssessment";

/** Back-compatible wrapper: the Customer scenario is now just the "customer" Domain Pack. */
export type CustomerAssessmentResult = DomainAssessmentResult;

export interface CustomerRunOptions {
  rootDir: string;
  now?: Date;
}

export function runCustomerAssessment(options: CustomerRunOptions): CustomerAssessmentResult {
  return runDomainAssessment({ rootDir: options.rootDir, domainId: "customer", now: options.now });
}
