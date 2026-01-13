"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disputeId: string | null;
  onUpdated?: () => void;
};

export default function RestaurantDisputeModal({ open, onOpenChange, disputeId, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const id = useMemo(() => (disputeId ? String(disputeId) : ""), [disputeId]);

  const load = async () => {
    try {
      if (!id) return;
      setLoading(true);
      setData(null);

      const res = await fetch(`/api/disputes/${id}`, { method: "GET" });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to load dispute");
      }

      setData(json.data);
      const existingMessage = typeof json?.data?.restaurantResponse?.message === 'string' ? json.data.restaurantResponse.message : '';
      setMessage(existingMessage);
    } catch (e: any) {
      alert(e?.message || "Failed to load dispute");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && id) {
      load();
    }
    if (!open) {
      setFiles([]);
    }
  }, [open, id]);

  const uploadEvidence = async (): Promise<string[]> => {
    if (!files.length) return [];

    const formData = new FormData();
    files.slice(0, 6).forEach((f) => formData.append("evidence", f));

    const res = await fetch("/api/disputes/uploads", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || "Failed to upload evidence");
    }

    return Array.isArray(json?.files)
      ? json.files.map((x: any) => (typeof x?.url === "string" ? x.url : "")).filter(Boolean).slice(0, 6)
      : [];
  };

  const handleSubmit = async () => {
    try {
      if (!id) return;
      const m = message.trim();
      if (!m) {
        alert("Please enter a response message");
        return;
      }

      setSaving(true);
      const evidenceUrls = await uploadEvidence();

      const res = await fetch(`/api/disputes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "respond", message: m, evidenceUrls }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to submit response");
      }

      alert("Response submitted");
      onUpdated?.();
      onOpenChange(false);
    } catch (e: any) {
      alert(e?.message || "Failed to submit response");
    } finally {
      setSaving(false);
    }
  };

  const evidenceUrls: string[] = Array.isArray(data?.evidence)
    ? data.evidence.map((x: any) => (typeof x?.url === "string" ? x.url : "")).filter(Boolean)
    : [];

  const orderLabel = data?.order?.orderId || (data?.order?._id ? String(data.order._id).slice(-6) : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispute</DialogTitle>
          <DialogDescription>{orderLabel ? `Order #${orderLabel}` : id ? `Dispute ${id.slice(-6)}` : ""}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : !data ? (
          <div className="text-sm text-muted-foreground">No data</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-sm font-medium">{String(data.status || "")}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div className="text-sm font-medium">{data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Reason</div>
              <div className="text-sm font-medium">{String(data.reason || "-")}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Customer Description</div>
              <div className="text-sm whitespace-pre-wrap">{String(data.description || "-")}</div>
            </div>

            {evidenceUrls.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground">Customer Evidence</div>
                <div className="mt-2 space-y-1">
                  {evidenceUrls.slice(0, 12).map((u) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                      {u}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="text-sm font-semibold mb-2">Your Response</div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your response to the customer..."
                rows={4}
              />

              <div className="mt-3 space-y-2">
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
                {files.length > 0 && <div className="text-xs text-muted-foreground">Selected: {files.length} file(s)</div>}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={saving || loading || !data}>
            {saving ? "Submitting..." : "Submit Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
