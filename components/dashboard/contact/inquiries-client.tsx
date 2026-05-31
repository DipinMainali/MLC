"use client";

import { useState } from "react";
import type {
  AdminInquiry,
  InquiryFormState,
} from "@/components/dashboard/admin-types";
import { InquiriesSection } from "./inquiries-section";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

type InquiriesClientProps = {
  initialInquiries: AdminInquiry[];
};

export default function InquiriesClient({
  initialInquiries,
}: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(
    initialInquiries ?? [],
  );
  const [inquiryForm, setInquiryForm] = useState<InquiryFormState | null>(null);
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  // Confirmation dialog state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function onEditInquiry(inquiry: AdminInquiry) {
    setEditingInquiryId(inquiry.id);
    setInquiryForm({
      status: inquiry.status ?? "new",
      assignedTo: inquiry.assignedTo ?? "",
      adminNotes: inquiry.adminNotes ?? "",
    });
  }

  // Instead of immediately deleting, open confirmation dialog
  function onRemoveInquiry(id: string) {
    setConfirmDeleteId(id);
    setConfirmOpen(true);
  }

  async function performDeleteConfirmed() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmOpen(false);

    // optimistic update
    const previous = inquiries;
    setInquiries((current) => current.filter((i) => i.id !== id));
    if (editingInquiryId === id) {
      setEditingInquiryId(null);
      setInquiryForm(null);
    }

    try {
      setSaving(`inquiry:${id}`);

      const res = await fetch(`/api/content/inquiries/${id}`, {
        method: "DELETE",
      });

      const payload = await res.json();

      if (!res.ok) {
        // revert optimistic
        setInquiries(previous);
        console.error(payload);
        toast({
          title: "Failed to delete",
          description: payload?.message ?? "Could not delete inquiry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Inquiry deleted",
        description: "The message was removed from the inbox.",
      });
    } catch (err) {
      setInquiries(previous);
      console.error(err);
      toast({
        title: "Failed to delete",
        description: "An error occurred while deleting the inquiry.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
      setConfirmDeleteId(null);
    }
  }

  async function onSaveInquiry() {
    if (!editingInquiryId || !inquiryForm) return;

    try {
      setSaving(`inquiry:${editingInquiryId}`);

      const res = await fetch(`/api/content/inquiries/${editingInquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      });

      const payload = await res.json();

      if (!res.ok) {
        console.error(payload);
        toast({
          title: "Failed to save",
          description: payload?.message ?? "Failed to save inquiry",
          variant: "destructive",
        });
        return;
      }

      const updated = payload?.inquiry;

      if (updated) {
        setInquiries((current) =>
          current.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)),
        );
      }

      toast({ title: "Saved", description: "Inquiry updated." });

      setEditingInquiryId(null);
      setInquiryForm(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to save",
        description: "An error occurred while saving the inquiry.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  }

  function onResetInquiryForm() {
    setEditingInquiryId(null);
    setInquiryForm(null);
  }

  return (
    <>
      <InquiriesSection
        inquiries={inquiries}
        inquiryForm={inquiryForm}
        editingInquiryId={editingInquiryId}
        saving={saving}
        setInquiryForm={setInquiryForm}
        onEditInquiry={onEditInquiry}
        onRemoveInquiry={onRemoveInquiry}
        onSaveInquiry={onSaveInquiry}
        onResetInquiryForm={onResetInquiryForm}
      />

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDeleteId(null);
          }
          setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this inquiry? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDeleteConfirmed}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
