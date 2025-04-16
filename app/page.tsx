import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="absolute inset-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-500 to-neutral-400 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Personal Finance Visualizer
        </h1>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="text-black bg-gradient-to-b from-blue-300 to-blue-800 hover:bg-indigo-700 cursor-pointer"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
