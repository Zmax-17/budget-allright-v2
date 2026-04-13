import { ReactNode } from "react";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
} from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import clsx from "clsx";

export type CardType = "balance" | "income" | "withdraw";

interface CardConfig {
  icon: ReactNode;
  bg: string;
  text: string;
}

interface CardProps {
  type: CardType;
  title: string;
  value: string;
  icon?: ReactNode;
  bgClass?: string;
  textClass?: string;
  className?: string;
}

const defaultConfig: Record<CardType, CardConfig> = {
  balance: {
    icon: (
      <TbMoneybag className="text-yellow-700 dark:text-yellow-400 text-xl" />
    ),
    bg: "bg-white dark:bg-gray-800",
    text: "text-gray-900 dark:text-gray-100",
  },
  income: {
    icon: (
      <FaArrowCircleUp className="text-green-600 dark:text-emerald-300 text-xl" />
    ),
    bg: "bg-emerald-200 dark:bg-emerald-800",
    text: "dark:text-white",
  },
  withdraw: {
    icon: (
      <FaArrowCircleDown className="text-red-600 dark:text-red-400 text-xl" />
    ),
    bg: "bg-red-300 dark:bg-red-800",
    text: "dark:text-white",
  },
};

export default function Card({
  type,
  title,
  value,
  icon,
  bgClass,
  textClass,
}: CardProps) {
  const config = defaultConfig[type];

  const cardIcon = icon ?? config.icon;
  const bg = bgClass ?? config.bg;
  const text = textClass ?? config.text;

  return (
    <div
      role="region"
      aria-labelledby={`${type}-title`}
      className={clsx(
        "rounded-2xl shadow-lg p-6 min-w-[200px] max-w-md space-y-4 flex flex-wrap gap-4 justify-between transition-colors duration-300",
        bg,
        text,
      )}
    >
      <p
        id={`${type}-title`}
        className="flex items-center gap-2 transition-colors duration-300"
      >
        {cardIcon}
        <span>{title}:</span> {value}
      </p>
    </div>
  );
}
