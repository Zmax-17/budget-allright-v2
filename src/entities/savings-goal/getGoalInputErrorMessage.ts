import { GoalValidationResult } from "@/entities/savings-goal/validation";

export function getGoalInputErrorMessage(
  result: GoalValidationResult,
) {
  if (result.type !== "error") return null;

  switch (result.code) {
    case "INVALID_AMOUNT":
      return "Amount must be greater than 0";

    case "NOT_ENOUGH_BALANCE":
      return "Not enough balance";

    case "NOT_ENOUGH_IN_GOAL":
      return "Not enough in goal";

    case "OVER_GOAL":
      return `Only ${result.remaining.toLocaleString("no-NO")} kr needed to reach goal`;

    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
