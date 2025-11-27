import { NextResponse } from "next/server";
import axios from "axios";

function toNumber(val: any, fallback: number) {
  const n = typeof val === "number" ? val : Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function coalesce<T>(v: T | undefined | null, fb: T): T {
  return v !== undefined && v !== null ? v : fb;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const external = body?.external || {};
    const categories: Array<{ _id: string; name: string }> = Array.isArray(body?.categories)
      ? body.categories
      : [];

    const title = external?.title || external?.name || "";
    const desc = external?.description || "";
    const images: string[] = Array.isArray(external?.images) && external.images.length > 0
      ? external.images
      : (external?.thumbnail ? [external.thumbnail] : []);

    const base: any = {
      name: title,
      description: desc,
      brand: external?.brand || "",
      price: toNumber(external?.price, 0),
      originalPrice: toNumber(external?.price, 0),
      stock: typeof external?.stock === "number" ? external.stock : 0,
      inStock: typeof external?.stock === "number" ? external.stock > 0 : true,
      images,
      tags: [],
      features: [],
      specifications: {},
      nutritionalInfo: {},
      deliveryInfo: {
        freeDelivery: false,
        estimatedDays: "2-3 days",
        expressAvailable: false,
        expressDays: "",
      },
      warranty: "",
      warrantyPeriod: "",
      category: "",
    };

    const hay = `${title} ${desc}`.toLowerCase();
    const sweets = ["sweet","sweets","mithai","laddu","ladoo","barfi","gulab","jalebi","peda","halwa","rasgulla","kaju","katli","sonpapdi","soan","burfi"]; 
    const masalas = ["masala","masalas","spice","spices","garam","chili","chilli","turmeric","cumin","coriander","cardamom","clove","fenugreek","pepper","hing"]; 
    const beverages = ["tea","chai","coffee"]; 

    const findCat = (names: string[]) => {
      const cat = categories.find((c) => names.some((k) => (c?.name || "").toLowerCase().includes(k)));
      return cat?._id || "";
    };

    let categoryId = "";
    if (sweets.some((w) => hay.includes(w))) categoryId = findCat(["sweet","sweets","mithai"]);
    else if (masalas.some((w) => hay.includes(w))) categoryId = findCat(["masala","spice","spices"]);
    else if (beverages.some((w) => hay.includes(w))) categoryId = findCat(["tea","coffee","beverage"]);

    base.category = categoryId || "";

    const hasCohere = !!process.env.COHERE_API_KEY;
    if (!hasCohere) {
      return NextResponse.json({ enriched: base, source: "fallback" });
    }

    const preamble = `You are assisting a food e-commerce admin. Output strictly compact JSON with these keys only: name, description, brand, tags, features, specifications, nutritionalInfo, deliveryInfo, warranty, warrantyPeriod.
- If a field is missing or not inferable, return an empty value of the correct type.
- Do not invent prices or stock.
- Keep name concise and user-friendly.
- deliveryInfo keys: freeDelivery (boolean), estimatedDays (string), expressAvailable (boolean), expressDays (string).`;

    const message = `Title: ${title}\nDescription: ${desc}`;

    const cohereRes = await axios.post(
      "https://api.cohere.com/v1/chat",
      {
        model: "command-r-08-2024",
        message,
        preamble,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        },
        timeout: 12000,
      }
    );

    const text = coalesce<string>(cohereRes?.data?.text || cohereRes?.data?.reply, "");
    let ai: any = {};
    try {
      ai = text ? JSON.parse(text) : {};
    } catch (_) {
      ai = {};
    }

    const merged = {
      ...base,
      name: ai?.name || base.name,
      description: ai?.description || base.description,
      brand: ai?.brand || base.brand,
      tags: Array.isArray(ai?.tags) ? ai.tags : base.tags,
      features: Array.isArray(ai?.features) ? ai.features : base.features,
      specifications: typeof ai?.specifications === "object" && ai?.specifications !== null ? ai.specifications : base.specifications,
      nutritionalInfo: typeof ai?.nutritionalInfo === "object" && ai?.nutritionalInfo !== null ? ai.nutritionalInfo : base.nutritionalInfo,
      deliveryInfo: typeof ai?.deliveryInfo === "object" && ai?.deliveryInfo !== null ? {
        freeDelivery: !!ai.deliveryInfo.freeDelivery,
        estimatedDays: ai.deliveryInfo.estimatedDays || base.deliveryInfo.estimatedDays,
        expressAvailable: !!ai.deliveryInfo.expressAvailable,
        expressDays: ai.deliveryInfo.expressDays || base.deliveryInfo.expressDays,
      } : base.deliveryInfo,
      warranty: typeof ai?.warranty === "string" ? ai.warranty : base.warranty,
      warrantyPeriod: typeof ai?.warrantyPeriod === "string" ? ai.warrantyPeriod : base.warrantyPeriod,
    };

    return NextResponse.json({ enriched: merged, source: "cohere" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to enrich" }, { status: 500 });
  }
}
