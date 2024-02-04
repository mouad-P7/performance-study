import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-center w-full h-screen flex-col gap-6">
      <h2 className="h2-bold">Page Not Found</h2>
      <p className="paragraph-semibold">404 | This page could not be found.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
