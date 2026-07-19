import { DemoTransactions } from "../types";
import { demo2026Q1 } from "./q1";
import { demo2026Q2 } from "./q2";
import { demo2026Q3 } from "./q3";

export const demo2026: DemoTransactions = [
  ...demo2026Q1,
  ...demo2026Q2,
  ...demo2026Q3,
] as const;
