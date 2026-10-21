"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Modal } from "./modal";
export function MobileFilters({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-filter">
      <button className="button button-outline" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={15} /> Filter & sort
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Find your feeling"
        drawer
      >
        {children}
      </Modal>
    </div>
  );
}
