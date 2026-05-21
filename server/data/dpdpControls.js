export const dpdpControls = [
  {
    id: "APPLICABILITY",
    section: "Applicability",
    requirement:
      "DPDP applies to digital personal data processed in India and outside India where goods or services are offered to Data Principals in India.",
    neuravaModule: "Compliance Scope",
    statusKey: "applicabilityImplemented",
    source: "DPDP Act applicability provisions",
  },
  {
    id: "NOTICE_MANAGEMENT",
    section: "Notice Management",
    requirement:
      "Data Principal must receive clear notice explaining what personal data is processed and for what purpose.",
    neuravaModule: "Privacy Notices",
    statusKey: "noticeImplemented",
    source: "DPDP notice obligations",
  },
  {
    id: "CONSENT_MANAGEMENT",
    section: "Consent Management",
    requirement:
      "Consent must be free, specific, informed, unconditional, unambiguous, and capable of withdrawal.",
    neuravaModule: "Consent",
    statusKey: "consentImplemented",
    source: "DPDP consent obligations",
  },
  {
    id: "PURPOSE_LIMITATION",
    section: "Purpose Limitation",
    requirement:
      "Personal data must be processed only for the lawful purpose disclosed to the Data Principal.",
    neuravaModule: "Privacy Notices",
    statusKey: "purposeImplemented",
    source: "DPDP lawful purpose obligations",
  },
  {
  id: "DATA_MINIMIZATION",
  section: "Data Minimization",
  requirement:
    "Only the minimum personal data necessary for the stated lawful purpose should be collected and processed.",
  neuravaModule: "Data Minimization Engine",
  statusKey: "dataMinimizationImplemented",
  source: "DPDP data minimization obligations",
},
  {
    id: "DATA_PRINCIPAL_RIGHTS",
    section: "Data Principal Rights",
    requirement:
      "Data Principal has rights to access information, correction, completion, updating, erasure, grievance redressal, and nomination.",
    neuravaModule: "Data Subject Rights",
    statusKey: "rightsImplemented",
    source: "DPDP Data Principal rights",
  },
  {
    id: "CORRECTION_ERASURE",
    section: "Correction & Erasure",
    requirement:
      "Data Fiduciary must correct, complete, update, and erase personal data where applicable.",
    neuravaModule: "Data Subject Rights",
    statusKey: "rightsImplemented",
    source: "DPDP correction and erasure obligations",
  },
  {
    id: "GRIEVANCE_REDRSSAL",
    section: "Grievance Redressal",
    requirement:
      "Data Fiduciary must provide an effective grievance redressal mechanism.",
    neuravaModule: "Data Subject Rights",
    statusKey: "grievanceImplemented",
    source: "DPDP grievance obligations",
  },
  {
    id: "RETENTION_ERASURE",
    section: "Retention & Erasure",
    requirement:
      "Personal data should be erased when purpose is complete unless retention is legally required.",
    neuravaModule: "Retention Policies",
    statusKey: "retentionImplemented",
    source: "DPDP retention and erasure obligations",
  },
  {
    id: "SECURITY_SAFEGUARDS",
    section: "Security Safeguards",
    requirement:
      "Reasonable security safeguards must be implemented to prevent personal data breach.",
    neuravaModule: "Guardrails / Security",
    statusKey: "securityImplemented",
    source: "DPDP security obligations",
  },
  {
    id: "ENCRYPTION_MASKING",
    section: "Encryption & Masking",
    requirement:
      "Technical safeguards such as encryption, masking, access restriction, and secure handling support reasonable security safeguards.",
    neuravaModule: "Data Security",
    statusKey: "encryptionImplemented",
    source: "Security safeguard implementation control",
  },
  {
    id: "ACCESS_CONTROL",
    section: "Access Control",
    requirement:
      "Access to personal data should be restricted to authorized users based on role and need.",
    neuravaModule: "Users / RBAC",
    statusKey: "accessControlImplemented",
    source: "Security safeguard implementation control",
  },
  {
    id: "AUDIT_LOGS",
    section: "Audit Logs",
    requirement:
      "Processing activity, risk decisions, consent, and incident evidence should be auditable.",
    neuravaModule: "Observability / Logs",
    statusKey: "auditLogsImplemented",
    source: "Auditability and evidence control",
  },
  {
    id: "BREACH_DETECTION",
    section: "Breach Detection",
    requirement:
      "Personal data breaches should be detected, recorded, investigated, and tracked.",
    neuravaModule: "Breach Management",
    statusKey: "breachImplemented",
    source: "DPDP breach obligations",
  },
  {
    id: "BREACH_NOTIFICATION",
    section: "Breach Notification",
    requirement:
      "Data Fiduciary must notify the Board and affected Data Principals in case of personal data breach.",
    neuravaModule: "Breach Management",
    statusKey: "breachNotificationImplemented",
    source: "DPDP breach notification obligations",
  },
  {
    id: "PROCESSOR_GOVERNANCE",
    section: "Processor Governance",
    requirement:
      "Data processors should be governed through contracts, controls, and accountability mechanisms.",
    neuravaModule: "Vendor Governance",
    statusKey: "processorGovernanceImplemented",
    source: "Data processor governance control",
  },
  {
    id: "CHILDREN_DATA",
    section: "Children Data",
    requirement:
      "Processing children’s personal data requires verifiable guardian consent and additional protections.",
    neuravaModule: "Children Data Controls",
    statusKey: "childrenImplemented",
    source: "DPDP children data obligations",
  },
  {
    id: "CHILD_PROFILING_ADS",
    section: "Child Profiling / Ads Restriction",
    requirement:
      "Tracking, behavioural monitoring, or targeted advertising directed at children should be restricted.",
    neuravaModule: "Children Data Controls",
    statusKey: "childrenProfilingImplemented",
    source: "DPDP children data obligations",
  },
  {
    id: "NOMINATION",
    section: "Nomination",
    requirement:
      "Data Principal should be able to nominate another person to exercise rights in case of death or incapacity.",
    neuravaModule: "Nomination Workflow",
    statusKey: "nominationImplemented",
    source: "DPDP nomination right",
  },
  {
    id: "CONSENT_MANAGER",
    section: "Consent Manager",
    requirement:
      "Data Principal may give, manage, review, or withdraw consent through a Consent Manager.",
    neuravaModule: "Consent Manager Integration",
    statusKey: "consentManagerImplemented",
    source: "DPDP consent manager provisions",
  },
  {
    id: "SIGNIFICANT_DATA_FIDUCIARY",
    section: "Significant Data Fiduciary",
    requirement:
      "Significant Data Fiduciaries may require DPO, DPIA, independent audit, and additional compliance obligations.",
    neuravaModule: "SDF Governance",
    statusKey: "sdfImplemented",
    source: "DPDP SDF obligations",
  },
  {
    id: "DPO",
    section: "Data Protection Officer",
    requirement:
      "SDFs and applicable organizations should support DPO accountability and contact workflows.",
    neuravaModule: "DPO Workspace",
    statusKey: "dpoImplemented",
    source: "DPDP DPO obligations",
  },
  {
    id: "DPIA",
    section: "DPIA",
    requirement:
      "Data Protection Impact Assessments may be required for Significant Data Fiduciaries.",
    neuravaModule: "DPIA Assessment",
    statusKey: "dpiaImplemented",
    source: "DPDP SDF obligations",
  },
  {
    id: "INDEPENDENT_AUDIT",
    section: "Independent Audit",
    requirement:
      "Independent audits may be required for Significant Data Fiduciaries.",
    neuravaModule: "Audit Reports",
    statusKey: "independentAuditImplemented",
    source: "DPDP SDF obligations",
  },
  {
    id: "CROSS_BORDER_TRANSFER",
    section: "Cross-Border Transfer",
    requirement:
      "Cross-border transfer should respect restricted countries or government-notified limitations.",
    neuravaModule: "Cross-Border Transfer Governance",
    statusKey: "crossBorderImplemented",
    source: "DPDP cross-border transfer provisions",
  },
  {
    id: "DATA_PRINCIPAL_DUTIES",
    section: "Data Principal Duties",
    requirement:
      "Data Principals have duties such as not filing false grievances or impersonating others.",
    neuravaModule: "User Duties Notice",
    statusKey: "dataPrincipalDutiesImplemented",
    source: "DPDP Data Principal duties",
  },
];