"use client";

import React, { useMemo, useState } from "react";
import { X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const totalPrice = Math.round(unitPricePreview * quantity * 100) / 100;

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

    if (Array.isArray(product.addonGroups)) {
      for (const g of product.addonGroups) {
        const count = selectedAddons.filter((x) => x.group === g.name).length;
        const min = Number(g.min || 0);
        if (min > 0 && count < min) return false;
      }
    }

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      if (!selectedVariant?.name || !selectedVariant?.option) return false;
    }

    return quantity > 0;
  }, [product, quantity, selectedVariant, selectedAddons]);

  if (!open || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-lg bg-card border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-48 md:h-56 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8">
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={product.images?.[0] || "/placeholder-product.png"}
              alt={product.name}
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="p-6 md:p-8 flex-1 overflow-y-auto no-scrollbar">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                {product.name}
              </h2>
              <p className="text-primary font-black text-xl">₹{unitPricePreview}</p>
            </div>

            <div className="space-y-8">
              {/* Variants */}
              {Array.isArray(product.variants) && product.variants.length > 0 && (
                <div>
                  {product.variants.map((v) => (
                    <div key={v.name} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded-full"></span>
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">{v.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {v.options.map((o) => (
                          <button
                            key={o.name}
                            disabled={o.inStock === false}
                            onClick={() => setSelectedVariant({ name: v.name, option: o.name })}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-bold transition-all text-left flex flex-col gap-1 ${selectedVariant?.option === o.name
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-100 dark:border-white/5 hover:border-primary/50"
                              } ${o.inStock === false ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{o.name}</span>
                              {selectedVariant?.option === o.name && <Check className="w-4 h-4" />}
                            </div>
                            {o.price > 0 && <span className="text-xs text-gray-400">+₹{o.price}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add-ons */}
              {Array.isArray(product.addonGroups) && product.addonGroups.length > 0 && (
                <div className="space-y-8">
                  {product.addonGroups.map((g) => {
                    const selectedForGroup = selectedAddons.filter((x) => x.group === g.name);
                    const isSingle = (g.selectionType || "multiple") === "single";

                    return (
                      <div key={g.name} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-1 w-8 bg-primary rounded-full"></span>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">{g.name}</h3>
                          </div>
                          {(g.min || g.max) && (
                            <span className="text-[10px] font-black uppercase bg-secondary px-2 py-1 rounded-md text-primary">
                              {g.min ? `Min ${g.min}` : ""} {g.max ? `Max ${g.max}` : ""}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {g.options.map((o) => {
                            const checked = selectedAddons.some((x) => x.group === g.name && x.option === o.name);
                            const disabled = o.inStock === false;

                            return (
                              <button
                                key={o.name}
                                disabled={disabled}
                                onClick={() => {
                                  if (isSingle) {
                                    setSelectedAddons((prev) => [...prev.filter((x) => x.group !== g.name), { group: g.name, option: o.name }]);
                                  } else {
                                    if (checked) {
                                      setSelectedAddons((prev) => prev.filter((x) => !(x.group === g.name && x.option === o.name)));
                                    } else {
                                      if (g.max && selectedForGroup.length >= g.max) return;
                                      setSelectedAddons((prev) => [...prev, { group: g.name, option: o.name }]);
                                    }
                                  }
                                }}
                                className={`w-full px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all text-left flex items-center justify-between ${checked
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-gray-100 dark:border-white/5 hover:border-primary/50"
                                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <div className="flex flex-col">
                                  <span>{o.name}</span>
                                  {o.price > 0 && <span className="text-xs text-gray-400">+₹{o.price}</span>}
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary text-white" : "border-gray-200"}`}>
                                  {checked && <Check className="w-4 h-4 stroke-[3px]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-white dark:bg-card p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-black w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                disabled={!canConfirm}
                onClick={() => onConfirm({ quantity, configKey, variant: selectedVariant, addons: selectedAddons })}
                className={`flex-1 flex items-center justify-center gap-3 h-16 rounded-[1.5rem] font-black text-sm md:text-base uppercase tracking-widest transition-all ${canConfirm
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl shadow-black/10 hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart — ₹{totalPrice}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
