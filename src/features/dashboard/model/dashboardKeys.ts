export const dashboardKeys = {
  all: ["dashboard"] as const,
  byMonth: (userId: string | undefined, month: string) =>
    [
      ...dashboardKeys.all,
      userId,
      "byMonth",
      month,
    ] as const,
  // If in the future, for example, a filter by category is added
  // byMonthAndCategory: (
  //   userId: string | undefined,
  //   month: string,
  //   category: string,
  // ) =>
  //   [
  //     ...dashboardKeys.byMonth(userId, month),
  //     "category",
  //     category,
  //   ] as const,
} as const;
