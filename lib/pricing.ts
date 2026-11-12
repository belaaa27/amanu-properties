import { Prisma } from "../generated/prisma/client";

export type PricingMode = "TOTAL_ONLY" | "PER_SQM_ONLY" | "EXPLICIT_BOTH";

export interface PricingInput {
  pricingMode: PricingMode;
  areaSqm?: number | string | null;
  pricePerSqm?: number | string | null;
  totalPrice?: number | string | null;
}

export interface PricingOutput {
  areaSqm: Prisma.Decimal | null;
  pricePerSqm: Prisma.Decimal | null;
  totalPrice: Prisma.Decimal | null;
  pricingMode: PricingMode;
}

/**
 * Validates and computes property pricing attributes using Prisma.Decimal.
 * Standard half-up rounding to 2 decimal places is applied.
 */
export function calculatePropertyPricing(input: PricingInput): PricingOutput {
  const { pricingMode, areaSqm, pricePerSqm, totalPrice } = input;

  const area =
    areaSqm !== undefined && areaSqm !== null && areaSqm !== ""
      ? new Prisma.Decimal(areaSqm)
      : null;
  let sqmPrice =
    pricePerSqm !== undefined && pricePerSqm !== null && pricePerSqm !== ""
      ? new Prisma.Decimal(pricePerSqm)
      : null;
  let total =
    totalPrice !== undefined && totalPrice !== null && totalPrice !== ""
      ? new Prisma.Decimal(totalPrice)
      : null;

  if (pricingMode === "TOTAL_ONLY") {
    if (!total || total.lte(0)) {
      throw new Error(
        "Total price must be greater than zero for TOTAL_ONLY pricing mode.",
      );
    }
    sqmPrice = null;
  } else if (pricingMode === "PER_SQM_ONLY") {
    if (!sqmPrice || sqmPrice.lte(0)) {
      throw new Error(
        "Price per sqm must be greater than zero for PER_SQM_ONLY mode.",
      );
    }
    if (!area || area.lte(0)) {
      throw new Error(
        "Property area (m²) is required to calculate total price in PER_SQM_ONLY mode.",
      );
    }
    total = area.mul(sqmPrice).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  } else if (pricingMode === "EXPLICIT_BOTH") {
    if (!total || total.lte(0)) {
      throw new Error(
        "Total asking price must be provided for EXPLICIT_BOTH mode.",
      );
    }
    if (!sqmPrice || sqmPrice.lte(0)) {
      throw new Error("Price per sqm must be provided for EXPLICIT_BOTH mode.");
    }
  }

  return {
    areaSqm: area
      ? area.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
      : null,
    pricePerSqm: sqmPrice
      ? sqmPrice.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
      : null,
    totalPrice: total
      ? total.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
      : null,
    pricingMode,
  };
}

/**
 * Formats monetary numbers into standard Ethiopian Birr (ETB) format.
 */
export function formatETB(
  amount: Prisma.Decimal | number | string | null | undefined,
): string {
  if (!amount) return "Contact for Price";
  const num =
    typeof amount === "object" && amount !== null && "toNumber" in amount
      ? (amount as Prisma.Decimal).toNumber()
      : Number(amount);
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(num);
}
