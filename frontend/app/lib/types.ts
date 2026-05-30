export interface HolderInfo {
  name: string | null;
  fatherName: string | null;
  dob: string | null;
}

export interface CredentialInfo {
  degree: string | null;
  institution: string | null;
  year: string | null;
  cgpa: string | null;
}

export interface IssuerInfo {
  name: string | null;
}

export interface ConfidenceScores {
  name?: number | null;
  fatherName?: number | null;
  dob?: number | null;
  degree?: number | null;
  institution?: number | null;
  year?: number | null;
  cgpa?: number | null;
}

export interface PageResult {
  page: number;
  text: string;
  engine: string;
}

export interface ExtractionData {
  document_type?: string;
  fields?: Record<string, string | null>;
  holder: HolderInfo;
  credential: CredentialInfo;
  issuer: IssuerInfo;
  confidence: ConfidenceScores;
  rawText: string;
  boundingBoxes?: number[][][];
  pageCount?: number;
  pageResults?: PageResult[];
}

export interface DocumentResult {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  filename?: string;
  data?: ExtractionData;
  error?: string;
  processedAt?: string;
  createdAt?: string;
}

export interface ProcessResponse {
  jobId: string;
  status: string;
}

export interface DocumentListItem {
  jobId: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt?: string;
  processedAt?: string;
}
