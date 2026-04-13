export interface PieItem {
  name: string | null;
  value: number;
  color: string;
}

export interface LineItem {
  date: string;
  income: number;
  withdraw: number;
}

export interface BarItem {
  name: string | null;
  income?: number;
  withdraw?: number;
  color?: string;
}

export interface SubCategoryItem {
  sub_category: string;
  amount: number;
  color: string;
}
