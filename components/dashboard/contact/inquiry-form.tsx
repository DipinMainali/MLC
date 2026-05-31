"use client";

import { useMemo, useState } from "react";
import type { AdminInquiry } from "@/components/dashboard/admin-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const inquiryStatusOptions = [
  "new",
  "in-progress",
  "responded",
  "closed",
  "archived",
];

type InquiryFormProps = {
  inquiry: AdminInquiry;
};

export function InquiryForm({ inquiry }: InquiryFormProps) {
  const router = useRouter();
  const initialState = useMemo(
    () => ({
      status: inquiry.status ?? "new",
      assignedTo: inquiry.assignedTo ?? "",
      adminNotes: inquiry.adminNotes ?? "",
    }),
    [inquiry],
  );

  const [status, setStatus] = useState(initialState.status);
  const [assignedTo, setAssignedTo] = useState(initialState.assignedTo);
  const [adminNotes, setAdminNotes] = useState(initialState.adminNotes);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(`/api/content/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedTo, adminNotes }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Save failed",
          description: payload?.message ?? "Could not update this inquiry.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Inquiry updated",
        description: "The inquiry details were saved successfully.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "Something went wrong while saving the inquiry.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2 border-b border-border/70 pb-5">
        <CardTitle className="text-xl">Edit inquiry</CardTitle>
        <CardDescription>
          Update status, ownership, and private admin notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={inquiry.data.name ?? "—"} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={inquiry.data.email ?? "—"} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={inquiry.data.subject ?? "—"} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {inquiryStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea value={inquiry.data.message ?? "—"} readOnly rows={6} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned to</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Ava, support@..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="adminNotes">Admin notes</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="Internal notes for the team..."
              rows={6}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSubmit as any}
            disabled={saving}
            className="rounded-full px-5"
          >
            Save inquiry
          </Button>
          <Button asChild variant="outline" className="rounded-full px-5">
            <a href="/dashboard/inquiries">Back to list</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
