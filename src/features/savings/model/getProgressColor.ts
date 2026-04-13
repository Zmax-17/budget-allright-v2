export default function getProgressColor(
  progress: number,
): string {
  if (progress >= 100) return "bg-green-500";
  else if (progress >= 75) return "bg-emerald-300";
  else if (progress >= 50) return "bg-orange-500";
  else if (progress >= 25) return "bg-yellow-500";
  else return "bg-red-500";
}
