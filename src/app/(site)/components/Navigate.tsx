import CardWithAnimatedButton from "./CardWithAnimatedButton";

export default function Navigate() {
  return (
    <div className="flex flex-col gap-3 p-3 md:flex-row">
      <CardWithAnimatedButton text="Our Prospectus" />
      <CardWithAnimatedButton text="Our Values" />
      <CardWithAnimatedButton text="Join Us" />
    </div>
  );
}
