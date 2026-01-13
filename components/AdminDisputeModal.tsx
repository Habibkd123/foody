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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disputeId: string | null;
  onUpdated?: () => void;
};

const ADMIN_ACTIONS = [
  { value: "set_status", label: "Set Status" },
  { value: "resolve", label: "Resolve" },
  { value: "reject", label: "Reject" },
] as const;

const STATUS_OPTIONS = ["open", "awaiting_restaurant", "awaiting_customer", "under_review", "resolved", "rejected"] as const;

export default function AdminDisputeModal({ open, onOpenChange, disputeId, onUpdated }: Props) {
  const id = useMemo(() => (disputeId ? String(disputeId) : ""), [disputeId]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const [action, setAction] = useState<string>("set_status");
  const [status, setStatus] = useState<string>("under_review");
  const [decisionNote, setDecisionNote] = useState<string>("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");

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
      const curStatus = String(json?.data?.status || "").toLowerCase();
      if (STATUS_OPTIONS.includes(curStatus as any)) {
        setStatus(curStatus);
      }
      const note = typeof json?.data?.adminMediation?.decisionNote === 'string' ? json.data.adminMediation.decisionNote : '';
      setDecisionNote(note);
      const amt = json?.data?.adminMediation?.refundRecommendation?.amount;
      setRefundAmount(typeof amt === 'number' ? String(amt) : '');
      const rr = typeof json?.data?.adminMediation?.refundRecommendation?.reason === 'string' ? json.data.adminMediation.refundRecommendation.reason : '';
      setRefundReason(rr);
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
  }, [open, id]);

  const handleSave = async () => {
    try {
      if (!id) return;
      setSaving(true);

      const payload: any = {
        action,
        decisionNote: decisionNote.trim(),
        refundRecommendation: {
          amount: refundAmount.trim() ? Number(refundAmount) : undefined,
          reason: refundReason.trim(),
        },
      };

      if (action === 'set_status') {
        payload.status = status;
      }

      const res = await fetch(`/api/disputes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to update dispute');
      }

      alert('Dispute updated');
      onUpdated?.();
      onOpenChange(false);
    } catch (e: any) {
      alert(e?.message || 'Failed to update dispute');
    } finally {
      setSaving(false);
    }
  };

  const evidenceUrls: string[] = Array.isArray(data?.evidence)
    ? data.evidence.map((x: any) => (typeof x?.url === 'string' ? x.url : '')).filter(Boolean)
    : [];

  const restaurantEvidenceUrls: string[] = Array.isArray(data?.restaurantResponse?.evidence)
    ? data.restaurantResponse.evidence.map((x: any) => (typeof x?.url === 'string' ? x.url : '')).filter(Boolean)
    : [];

  const orderLabel = data?.order?.orderId || (data?.order?._id ? String(data.order._id).slice(-6) : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Mediation</DialogTitle>
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
                <div className="text-xs text-muted-foreground">Current Status</div>
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

            {data?.restaurantResponse?.message && (
              <div>
                <div className="text-xs text-muted-foreground">Restaurant Response</div>
                <div className="text-sm whitespace-pre-wrap">{String(data.restaurantResponse.message)}</div>
              </div>
            )}

            {restaurantEvidenceUrls.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground">Restaurant Evidence</div>
                <div className="mt-2 space-y-1">
                  {restaurantEvidenceUrls.slice(0, 12).map((u) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                      {u}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t space-y-3">
              <div className="text-sm font-semibold">Decision</div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Action</div>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_ACTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {action === 'set_status' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium">Decision Note</div>
                <Textarea value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} rows={4} placeholder="Add admin decision notes..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Refund Amount (optional)</div>
                  <Input
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 199"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Refund Reason (optional)</div>
                  <Input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason" />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving || loading || !data}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
