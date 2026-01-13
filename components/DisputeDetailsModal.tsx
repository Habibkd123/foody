"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disputeId: string | null;
};

export default function DisputeDetailsModal({ open, onOpenChange, disputeId }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!open || !disputeId) return;
        setLoading(true);
        setData(null);

        const res = await fetch(`/api/disputes/${disputeId}`, { method: "GET" });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to load dispute");
        }
        setData(json.data);
      } catch (e: any) {
        alert(e?.message || "Failed to load dispute");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, disputeId]);

  const evidenceUrls: string[] = Array.isArray(data?.evidence)
    ? data.evidence
        .map((x: any) => (typeof x?.url === "string" ? x.url : ""))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const restaurantEvidenceUrls: string[] = Array.isArray(data?.restaurantResponse?.evidence)
    ? data.restaurantResponse.evidence
        .map((x: any) => (typeof x?.url === "string" ? x.url : ""))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispute Details</DialogTitle>
          <DialogDescription>
            {data?.order?.orderId ? `Order #${data.order.orderId}` : disputeId ? `Dispute ${disputeId.slice(-6)}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : !data ? (
            <div className="text-sm text-muted-foreground">No data</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-sm font-medium">{String(data.status || "")} </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm font-medium">
                    {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Reason</div>
                <div className="text-sm font-medium">{String(data.reason || "-")}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Description</div>
                <div className="text-sm whitespace-pre-wrap">{String(data.description || "-")}</div>
              </div>

              {evidenceUrls.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground">Customer Evidence</div>
                  <div className="mt-2 space-y-1">
                    {evidenceUrls.map((u) => (
                      <a
                        key={u}
                        href={u}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
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
                    {restaurantEvidenceUrls.map((u) => (
                      <a
                        key={u}
                        href={u}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {u}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {data?.adminMediation?.decisionNote && (
                <div>
                  <div className="text-xs text-muted-foreground">Admin Note</div>
                  <div className="text-sm whitespace-pre-wrap">{String(data.adminMediation.decisionNote)}</div>
                </div>
              )}

              {typeof data?.adminMediation?.refundRecommendation?.amount === "number" && (
                <div>
                  <div className="text-xs text-muted-foreground">Refund Recommendation</div>
                  <div className="text-sm font-medium">₹{Number(data.adminMediation.refundRecommendation.amount).toFixed(2)}</div>
                  {data?.adminMediation?.refundRecommendation?.reason && (
                    <div className="text-sm text-muted-foreground">{String(data.adminMediation.refundRecommendation.reason)}</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
