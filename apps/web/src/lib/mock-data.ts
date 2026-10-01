/**
 * Mock data for the Contact Verification prototype.
 * All screens read from here for consistent sample data.
 */

export type ClientStatus = "verified" | "unverified";

export interface MockClient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  agency: string;
  policyCount: number;
  quoteCount: number;
  verifiedDate?: string;
  akas?: string[];
}

export interface MockPolicy {
  id: string;
  address: string;
  premium: number;
  dwellingCoverage: number;
  deductible: number;
  effectiveDate: string;
  agency: string;
  agent: string;
  policyNumber?: string;
}

export const sampleAgency = {
  name: "Lakeside Insurance Group",
  agent: "Sarah Chen",
};

export const samplePolicy: MockPolicy = {
  id: "pol-001",
  address: "1423 Maple Drive, Austin, TX 78701",
  premium: 1847,
  dwellingCoverage: 350000,
  deductible: 2500,
  effectiveDate: "Nov 1, 2026",
  agency: sampleAgency.name,
  agent: sampleAgency.agent,
  policyNumber: "OB-2026-4819372",
};

export const verifiedClients: MockClient[] = [
  {
    id: "vc-1",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@email.com",
    phone: "(512) 555-0142",
    status: "verified",
    agency: sampleAgency.name,
    policyCount: 3,
    quoteCount: 0,
    verifiedDate: "Mar 12, 2026",
    akas: ["Janey Doe", "J. Doe LLC"],
  },
  {
    id: "vc-2",
    firstName: "Ron",
    lastName: "Doe",
    email: "ron.doe@email.com",
    phone: "(512) 555-0198",
    status: "verified",
    agency: sampleAgency.name,
    policyCount: 1,
    quoteCount: 1,
    verifiedDate: "Jun 4, 2026",
  },
  {
    id: "vc-3",
    firstName: "Marcus",
    lastName: "Williams",
    email: "marcus.w@outlook.com",
    status: "verified",
    agency: sampleAgency.name,
    policyCount: 2,
    quoteCount: 0,
    verifiedDate: "Aug 22, 2025",
    akas: ["Marcus T. Williams"],
  },
];

export const unverifiedClients: MockClient[] = [
  {
    id: "uv-1",
    firstName: "John",
    lastName: "Smith",
    status: "unverified",
    agency: sampleAgency.name,
    policyCount: 0,
    quoteCount: 2,
  },
  {
    id: "uv-2",
    firstName: "Priya",
    lastName: "Patel",
    status: "unverified",
    agency: sampleAgency.name,
    policyCount: 0,
    quoteCount: 1,
  },
  {
    id: "uv-3",
    firstName: "David",
    lastName: "Nguyen",
    status: "unverified",
    agency: sampleAgency.name,
    policyCount: 0,
    quoteCount: 3,
  },
];

// Halo internal view data
export const haloParentAccounts = [
  {
    id: "pa-1",
    email: "jane.doe@email.com",
    displayName: "Jane Doe",
    akas: ["Janey Doe", "J. Doe LLC"],
    partnerClients: [
      { agency: "Lakeside Insurance Group", name: "Jane Doe", policies: 3, verifiedDate: "Mar 12, 2026" },
      { agency: "Westbrook Agency", name: "Janey Doe", policies: 1, verifiedDate: "Jul 8, 2026" },
    ],
    totalPolicies: 4,
    created: "Mar 12, 2026",
    lastLogin: "Sep 28, 2026",
  },
  {
    id: "pa-2",
    email: "marcus.w@outlook.com",
    displayName: "Marcus Williams",
    akas: ["Marcus T. Williams"],
    partnerClients: [
      { agency: "Lakeside Insurance Group", name: "Marcus Williams", policies: 2, verifiedDate: "Aug 22, 2025" },
    ],
    totalPolicies: 2,
    created: "Aug 22, 2025",
    lastLogin: "Sep 15, 2026",
  },
  {
    id: "pa-3",
    email: "ron.doe@email.com",
    displayName: "Ron Doe",
    akas: [],
    partnerClients: [
      { agency: "Lakeside Insurance Group", name: "Ron Doe", policies: 1, verifiedDate: "Jun 4, 2026" },
      { agency: "Summit Partners", name: "Ronald Doe", policies: 2, verifiedDate: "Jan 18, 2026" },
      { agency: "TGS Insurance", name: "Ron Doe", policies: 1, verifiedDate: "Sep 3, 2026" },
    ],
    totalPolicies: 4,
    created: "Jan 18, 2026",
    lastLogin: "Oct 1, 2026",
  },
];

export const haloUnverifiedClients = [
  { name: "John Smith", agency: "Lakeside Insurance Group", quotes: 2, created: "Sep 20, 2026", hasPendingLink: true },
  { name: "Priya Patel", agency: "Lakeside Insurance Group", quotes: 1, created: "Sep 25, 2026", hasPendingLink: false },
  { name: "David Nguyen", agency: "Lakeside Insurance Group", quotes: 3, created: "Aug 14, 2026", hasPendingLink: false },
  { name: "Maria Gonzalez", agency: "Westbrook Agency", quotes: 1, created: "Sep 29, 2026", hasPendingLink: true },
  { name: "TBD Client", agency: "Hippo Analytics", quotes: 1, created: "Sep 30, 2026", hasPendingLink: false },
];
