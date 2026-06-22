import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/cn";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      className={cn("size-4 animate-spin", className)}
      aria-label="Loading"
      data-slot="spinner"
      role="status"
      {...props}
    />
  );
}

export { Spinner };
