export type InquiryData = {
  name?: string;
  email?: string;
  company?: string | null;
  subject?: string | null;
  message?: string;
  // allow any additional fields introduced later
  [key: string]: unknown;
};

export type InquiryRecord = {
  id: string;
  data: InquiryData;
  status: string;
  assignedTo: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt?: Date;
};

// `InquiryData` is the JSON payload stored inside `Inquiry.data`.
// Dashboard-specific fields live on `InquiryRecord`.
