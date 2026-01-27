"use client";

import ErrorComp from "@/components/ErrorComp";

function error({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorComp error={error} reset={reset} />;
}

export default error;
