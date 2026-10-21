import type { EnquiryStatus } from "./types";
export type AdminEnquiry = {
  id: string;
  reference: string;
  status: EnquiryStatus;
  notes: string;
  brief: Record<string, unknown> | null;
  admin_notes: string;
  estimated_subtotal: number;
  created_at: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unit_price: number;
    starting_price: boolean;
    shape: string;
    length: string;
    size: string;
    notes: string;
    addons: { name: string; price: number }[];
  }[];
};
