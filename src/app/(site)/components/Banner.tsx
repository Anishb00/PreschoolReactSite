import styles from "@/app/(site)/rootlayout.module.css";

interface BannerProps {
  imagename: string;
  title: string;
  subtitle: string;
}

export default function Banner({ imagename, title, subtitle }: BannerProps) {
  return (
    <div
      className="flex h-[60vh] w-full flex-col items-end justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${imagename})` }}
    >
      <div
        className={`float-right w-full p-20 sm:w-full md:w-7/12 lg:w-1/2 ${styles.primarycolor} opacity-95`}
      >
        <h1 className="mb-2 text-5xl text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="text-lg text-white sm:text-xl">{subtitle}</p>
      </div>
    </div>
  );
}
