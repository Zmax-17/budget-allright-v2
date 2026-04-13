export type Theme = "light" | "dark";

/**
 * Main expense/income categories
 * Used in dashboards, transactions, charts, and the add form
 */
export const categories = {
  "Cafe and restaurant": {
    color: {
      light: "#DC2626",
      dark: "#FF8787",
    },
    sub: [
      "Bars and nightlife",
      "Cafe",
      "Cafeteria",
      "Candy",
      "Convenience store",
      "Fast food",
      "Restaurant",
    ],
  },

  "Car insurance and car loan": {
    color: {
      light: "#0D9488",
      dark: "#63E6DA",
    },
    sub: [],
  },

  Children: {
    color: {
      light: "#CA8A04",
      dark: "#FFDE59",
    },
    sub: ["Children's store", "Other child expenses"],
  },

  "Clothing and gear": {
    color: {
      light: "#6A0572",
      dark: "#C084FC",
    },
    sub: [
      "Clothing",
      "Jewelry and accessories",
      "Shoes",
      "Sporting goods",
    ],
  },

  "Fixed living expenses": {
    color: {
      light: "#2C3E50",
      dark: "#A3B5C7",
    },
    sub: [
      "Alarm",
      "Electricity",
      "Home insurance",
      "Housing expenses",
      "Internet",
      "Mortgage",
      "Municipal fees",
      "Phone service",
      "Property management",
      "Rental and sales",
    ],
  },

  Groceries: {
    color: {
      light: "#16A34A",
      dark: "#30DD7A",
    },
    sub: ["Grocery store", "Other household items"],
  },

  "Health and wellbeing": {
    color: {
      light: "#2D2C8E",
      dark: "#8381F9",
    },
    sub: [
      "Beauty",
      "Dentist",
      "Eye care",
      "Health goods",
      "Medical services",
      "Pharmacy",
      "Wellbeing",
    ],
  },

  "Hobby and leisure": {
    color: {
      light: "#C2410C",
      dark: "#FFA94D",
    },
    sub: [
      "Cabin",
      "Crafts",
      "Dating",
      "Events",
      "Exercise",
      "Gift card",
      "Loans for hobby and leisure",
      "Movie Theater",
      "Museum",
      "Online marketplace",
      "Pets",
      "Photography",
      "Postal services",
      "Recreational activities",
      "Toys",
      "Web services",
    ],
  },

  "Home and garden": {
    color: {
      light: "#1E40AF",
      dark: "#5DADE2",
    },
    sub: [
      "Appliances",
      "Furniture and interior",
      "Garden and flowers",
      "Home improvement",
      "Kitchenware",
      "Tools",
      "Tradesperson",
    ],
  },

  Income: {
    color: {
      light: "#2ECC71",
      dark: "#4ade80",
    },
    sub: ["Salary", "Dividends", "Other income", "Wages"],
  },

  Insurance: {
    color: {
      light: "#64748B",
      dark: "#B0BEC5",
    },
    sub: [],
  },

  "Kindergarten and after-school care": {
    color: {
      light: "#B45309",
      dark: "#FF7A29",
    },
    sub: [],
  },

  "Media and entertainment": {
    color: {
      light: "#0284C7",
      dark: "#5DADF8",
    },
    sub: [
      "Apps and gaming",
      "Bookseller",
      "Gambling",
      "Magazines",
      "Newspaper",
      "Streaming services",
      "TV",
    ],
  },

  Miscellaneous: {
    color: {
      light: "#475569",
      dark: "#AAB7B8",
    },
    sub: [
      "Cash machine",
      "Credit card payment",
      "Digital currency",
      "Gift",
      "Interest",
      "Interest and fees",
      "Membership and charity",
      "Other expenses",
      "Payment",
      "Peer-to-peer payment",
      "Reimbursed expenses",
      "Safe deposit box",
      "Taxes",
      "Training and education",
      "Transfer",
    ],
  },

  "Other loan and debt": {
    color: {
      light: "#B91C1C",
      dark: "#F18479",
    },
    sub: ["Debt collection", "Other loans", "Student loan"],
  },

  Savings: {
    color: {
      light: "#047857",
      dark: "#2DECB8",
    },
    sub: [],
  },

  "Transportation and vehicles": {
    color: {
      light: "#7C3AED",
      dark: "#BE84E4",
    },
    sub: [
      "Car dealership",
      "Car parts and maintenance",
      "Car rental",
      "Driver's education",
      "Fuel and charging",
      "Mechanic",
      "Parking",
      "Public transport",
      "Taxi",
      "Toll",
      "Vehicle fees",
    ],
  },

  Travel: {
    color: {
      light: "#0F766E",
      dark: "#35E8C3",
    },
    sub: [
      "Accommodation",
      "Other travel",
      "Phone tickets",
      "Travel agency",
    ],
  },

  Uncategorized: {
    color: {
      light: "#6B7280",
      dark: "#DDE1E3",
    },
    sub: ["Unknown"],
  },
} as const;
/**
 * Fast sub - main lookup map
 * Built once at module load time
 */
export const subToMainMap: Map<SubCategory, MainCategory> =
  (() => {
    const map = new Map<SubCategory, MainCategory>();

    for (const main in categories) {
      const typedMain = main as MainCategory;

      for (const sub of categories[typedMain].sub) {
        map.set(sub, typedMain);
      }
    }

    return map;
  })();

export type MainCategory = keyof typeof categories;

export type SubCategory =
  (typeof categories)[MainCategory]["sub"][number];

export function getCategoryColor(
  name: string,
  theme: Theme,
): string {
  if (name in categories) {
    return categories[name as MainCategory].color[theme];
  }

  const main = subToMainMap.get(name as SubCategory);
  if (main) {
    return categories[main].color[theme];
  }

  return "#ccc";
}
