import CardWithAnimatedButton from "./CardWithAnimatedButton";

export default function Navigate() {
  return (
    <div className="flex flex-col gap-3 p-3 md:flex-row">
      <CardWithAnimatedButton text="Reviews" image="/Childrenclasroomactivity.png" />
      <CardWithAnimatedButton text="Our Values" image="/ChildrenGraduation.png" />
      <CardWithAnimatedButton text="Join Us" image="/Children.png" />
    </div>
  );
}
