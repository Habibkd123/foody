"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any | null;
  onCreated?: () => void;
};

const REASONS = [
  "Missing items",
  "Wrong items",
  "Quality issue",
  "Late delivery",
  "Damaged packaging",
  "Overcharged",
  "Other",
];

export default function RaiseDisputeModal({ open, onOpenChange, order, onCreated }: Props) {
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const orderId = useMemo(() => {
    if (!order) return "";
    return String(order?._id || "");
  }, [order]);

  const reset = () => {
    setReason("");
    setDescription("");
    setFiles([]);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const uploadEvidence = async (): Promise<string[]> => {
    if (!files.length) return [];

    const formData = new FormData();
    files.slice(0, 6).forEach((f) => formData.append("evidence", f));

    const res = await fetch("/api/disputes/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || "Failed to upload evidence");
    }

    const urls: string[] = Array.isArray(data?.files)
      ? data.files.map((x: any) => (typeof x?.url === "string" ? x.url : "")).filter(Boolean)
      : [];

    return urls.slice(0, 6);
  };

  const handleSubmit = async () => {
    try {
      if (!orderId) {
        alert("Order not found");
        return;
      }

      const r = reason.trim();
      const d = description.trim();

      if (!r) {
        alert("Please select a reason");
        return;
      }
      if (!d) {
        alert("Please enter a description");
        return;
      }

      setSubmitting(true);

      const evidenceUrls = await uploadEvidence();

      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason: r, description: d, evidenceUrls }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to create dispute");
      }

      alert("Dispute submitted successfully");
      onCreated?.();
      handleClose(false);
    } catch (e: any) {
      alert(e?.message || "Failed to submit dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise a Dispute</DialogTitle>
          <DialogDescription>
            Order #{order?.orderId || (order?._id ? String(order._id).slice(-6) : "")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Reason</div>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what went wrong..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Evidence (optional)</div>
            <Input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => {
                const next = Array.from(e.target.files || []);
                setFiles(next.slice(0, 6));
              }}
            />
            {files.length > 0 && (
              <div className="text-xs text-muted-foreground">Selected: {files.length} file(s)</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
