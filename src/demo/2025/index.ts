import { DemoTransactions } from "../types";
import { demo2025Q2 } from "./q2";
import { demo2025Q3 } from "./q3";
import { demo2025Q4 } from "./q4";

export const demo2025: DemoTransactions = [
  ...demo2025Q2,
  ...demo2025Q3,
  ...demo2025Q4,
] as const;
