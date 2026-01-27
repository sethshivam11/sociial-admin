import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  value: number;
  breakdown?: { [key: string]: number };
  trend?: number;
  className?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
}
