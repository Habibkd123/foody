"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

type VariantSelection = { name: string; option: string };
type AddonSelection = { group: string; option: string };

type ProductLike = {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  images?: string[];
  variants?: Array<{ name: string; selectionType?: "single"; options: Array<{ name: string; price: number; inStock?: boolean }> }>;
  addonGroups?: Array<{ name: string; selectionType?: "single" | "multiple"; min?: number; max?: number; options: Array<{ name: string; price: number; inStock?: boolean }> }>;
};

export default function ProductOptionsModal({
  open,
  product,
  onClose,
  onConfirm,
}: {
  open: boolean;
  product: ProductLike | null;
  onClose: () => void;
  onConfirm: (payload: { quantity: number; configKey: string; variant?: VariantSelection; addons?: AddonSelection[] }) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<VariantSelection | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<AddonSelection[]>([]);

  const basePrice = Number(product?.price || 0);

  const delta = useMemo(() => {
    let d = 0;
    if (!product) return d;

    if (selectedVariant && Array.isArray(product.variants)) {
      const v = product.variants.find((x) => x.name === selectedVariant.name);
      const opt = v?.options?.find((o) => o.name === selectedVariant.option);
      if (opt && opt.inStock !== false) d += Number(opt.price || 0);
    }

    if (Array.isArray(product.addonGroups)) {
      for (const a of selectedAddons) {
        const g = product.addonGroups.find((x) => x.name === a.group);
        const opt = g?.options?.find((o) => o.name === a.option);
        if (opt && opt.inStock !== false) d += Number(opt.price || 0);
      }
    }

    return d;
  }, [product, selectedVariant, selectedAddons]);

  const unitPricePreview = Math.round((basePrice + delta) * 100) / 100;

  const configKey = useMemo(() => {
    const v = selectedVariant ? `v:${selectedVariant.name}=${selectedVariant.option}` : "";
    const a = selectedAddons
      .slice()
      .sort((x, y) => `${x.group}:${x.option}`.localeCompare(`${y.group}:${y.option}`))
      .map((x) => `a:${x.group}=${x.option}`)
      .join("|");
    return [v, a].filter(Boolean).join("||") || "base";
  }, [selectedVariant, selectedAddons]);

  const canConfirm = useMemo(() => {
    if (!product) return false;

    // Validate addon min/max
    if (Array.isArray(product.addonGroups)) {
      for (const g of product.addonGroups) {
        const count = selectedAddons.filter((x) => x.group === g.name).length;
        const min = Number(g.min || 0);
        const max = Number(g.max || 0);
        if (min > 0 && count < min) return false;
        if (max > 0 && count > max) return false;
      }
    }

    // If variants exist, require one selection (MVP)
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      if (!selectedVariant?.name || !selectedVariant?.option) return false;
    }

    return quantity > 0;
  }, [product, quantity, selectedVariant, selectedAddons]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-600">₹{unitPricePreview} / item</div>
          </div>
          <button className="p-2" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {Array.isArray(product.variants) && product.variants.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-medium text-gray-900 mb-2">Variant</div>
              {product.variants.map((v) => (
                <div key={v.name} className="mb-2">
                  <div className="text-sm text-gray-700 mb-1">{v.name}</div>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={selectedVariant?.name === v.name ? selectedVariant.option : ""}
                    onChange={(e) => setSelectedVariant({ name: v.name, option: e.target.value })}
                  >
                    <option value="">Select</option>
                    {v.options.map((o) => (
                      <option key={o.name} value={o.name} disabled={o.inStock === false}>
                        {o.name} {Number(o.price || 0) ? `(₹${o.price})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(product.addonGroups) && product.addonGroups.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-medium text-gray-900 mb-2">Add-ons</div>
              {product.addonGroups.map((g) => {
                const selectedForGroup = selectedAddons.filter((x) => x.group === g.name);
                const max = Number(g.max || 0);
                const isSingle = (g.selectionType || "multiple") === "single";

                return (
                  <div key={g.name} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-700">{g.name}</div>
                      <div className="text-xs text-gray-500">
                        {g.min ? `min ${g.min}` : ""} {g.max ? `max ${g.max}` : ""}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {g.options.map((o) => {
                        const checked = selectedAddons.some((x) => x.group === g.name && x.option === o.name);
                        const disabled = o.inStock === false || (!isSingle && max > 0 && !checked && selectedForGroup.length >= max);

                        return (
                          <label key={o.name} className={`flex items-center justify-between rounded-lg border p-2 ${disabled ? 'opacity-50' : ''}`}>
                            <div className="text-sm text-gray-800">
                              {o.name} {Number(o.price || 0) ? <span className="text-gray-500">(₹{o.price})</span> : null}
                            </div>
                            <input
                              type={isSingle ? "radio" : "checkbox"}
                              name={`addon-${g.name}`}
                              checked={checked}
                              disabled={disabled}
                              onChange={(e) => {
                                if (isSingle) {
                                  setSelectedAddons((prev) => [...prev.filter((x) => x.group !== g.name), { group: g.name, option: o.name }]);
                                  return;
                                }
                                if (e.target.checked) {
                                  setSelectedAddons((prev) => [...prev, { group: g.name, option: o.name }]);
                                } else {
                                  setSelectedAddons((prev) => prev.filter((x) => !(x.group === g.name && x.option === o.name)));
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div className="text-sm font-medium text-gray-900">Quantity</div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded border"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                type="button"
              >
                -
              </button>
              <div className="w-10 text-center">{quantity}</div>
              <button
                className="h-8 w-8 rounded border"
                onClick={() => setQuantity((q) => q + 1)}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <button
            className={`w-full rounded-lg py-3 font-semibold ${canConfirm ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!canConfirm}
            onClick={() => onConfirm({ quantity, configKey, variant: selectedVariant, addons: selectedAddons })}
            type="button"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
