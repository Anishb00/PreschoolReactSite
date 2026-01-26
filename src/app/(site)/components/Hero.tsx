import Link from "next/link";
import Button from "@/app/components/ui/button";

export default function Hero({ imagename }: { imagename: string }) {
  return (
    <div
      className="flex h-screen flex-col items-center justify-center bg-green-500 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${imagename})` }}
    >
      <div className="h-[50%]"></div>
      <Link href="/Register">
        <Button>
          Now accepting students for {String(new Date().getFullYear())}
        </Button>
      </Link>
    </div>
  );
}
