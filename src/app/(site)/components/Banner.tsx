import styles from "@/app/(site)/rootlayout.module.css";

interface BannerProps {
  imagename: string;
  title: string;
  subtitle: string;
}

function BannerContent({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={`${styles.primarycolor} opacity-95 ${className}`}>
      <h1 className="mb-2 text-5xl text-white sm:text-6xl md:text-7xl">
        {title}
      </h1>
      <p className="text-lg text-white sm:text-xl">{subtitle}</p>
    </div>
  );
}

export default function Banner({ imagename, title, subtitle }: BannerProps) {
  return (
    <div className="w-full">
      <div
        className="flex h-[60vh] w-full flex-col items-end justify-end bg-cover bg-center"
        style={{ backgroundImage: `url(${imagename})` }}
      >
        <div className="hidden w-full lg:flex lg:justify-end">
          <BannerContent
            title={title}
            subtitle={subtitle}
            className="w-full p-12 sm:p-16 lg:w-fit lg:min-w-[50%] lg:max-w-[80%] lg:max-h-[875px] lg:p-20"
          />
        </div>
      </div>
      <div className="lg:hidden">
        <BannerContent title={title} subtitle={subtitle} className="w-full p-12 sm:p-16" />
      </div>
    </div>
  );
}
