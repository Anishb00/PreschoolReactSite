import Button from "@/app/components/ui/button";

export default function Hero({ imagename }: { imagename: string }) {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center bg-green-500 bg-cover bg-center"
      style={{ backgroundImage: `url(${imagename})` }}
    >
      <div className="h-[50%]"></div>
      <Button>
        Now accepting students for {String(new Date().getFullYear())}
      </Button>
      <div>Item2</div>
    </div>
  );
}
