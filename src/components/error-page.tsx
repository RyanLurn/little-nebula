import { useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";

import type { FallbackErrorCode, AppError } from "@/types/app-error";

import { buttonVariants, Button } from "@/components/ui/button";

export function ErrorPage({ message, retryable }: AppError<FallbackErrorCode>) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    setRetrying(true);
    await router.invalidate({ sync: true });
    setRetrying(false);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-3">
      <h1 className="text-lg text-destructive">500 - Internal server error</h1>
      <p>{message}</p>
      {retryable ? (
        <Button onClick={() => void handleRetry()} disabled={retrying}>
          Retry
        </Button>
      ) : (
        <Link className={buttonVariants({ variant: "outline" })} to="/">
          Back to Home page
        </Link>
      )}
    </div>
  );
}
