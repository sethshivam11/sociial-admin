import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

function ErrorComp({ error, reset }: { error: Error; reset: () => void }) {
  const [message, setMessage] = useState(error?.message);

  useEffect(() => {
    console.log(error);
    let errMessage = "Something went wrong";
    if (error instanceof AxiosError) {
      errMessage = error.response?.data?.message || error?.message;
    } else {
      errMessage = error?.message;
    }
    setMessage(errMessage);
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 lg:pl-68 h-dvh text-center">
      <div className="bg-muted p-3 rounded-lg">
        <AlertTriangle />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      <Button onClick={reset}>
        <RefreshCcw />
        Retry
      </Button>
    </div>
  );
}

export default ErrorComp;
