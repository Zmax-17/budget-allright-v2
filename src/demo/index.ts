import { demo2025 } from "./2025";
import { demo2026 } from "./2026";
import { DemoTransactions } from "./types";

export const DEMO_TRANSACTIONS: DemoTransactions = [
  ...demo2025,
  ...demo2026,
] as const;
