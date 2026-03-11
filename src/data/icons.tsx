import React from "react";
import { Users, Star, Briefcase, Globe, Coins, RefreshCw } from "lucide-react";

export const ICON_MAP: Record<string, React.ReactNode> = {
  users:     <Users size={20} />,
  star:      <Star size={20} />,
  briefcase: <Briefcase size={20} />,
  globe:     <Globe size={20} />,
  coins:     <Coins size={20} />,
  refresh:   <RefreshCw size={20} />,
};

export const ICON_KEYS = ["users", "star", "briefcase", "globe", "coins", "refresh"] as const;
