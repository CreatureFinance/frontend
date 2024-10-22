import { cn } from "@/utils/tools";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("animate-spin text-primary/60", className)} />;
};

export default Loader;
