import CardWithAnimatedButton from "./CardWithAnimatedButton";

export default function Navigate() {
  return (
    <div className="flex flex-col gap-3 p-3 md:flex-row">
      <CardWithAnimatedButton
        text="Reviews"
        image="/Childrenclasroomactivity.png"
        href="https://www.yelp.com/biz/stepping-stone-world-milpitas?osq=Stepping+Stone+world+preschool"
      />
      <CardWithAnimatedButton
        text="Our Values"
        image="/ChildrenGraduation.png"
        href="/AboutUs"
      />
      <CardWithAnimatedButton
        text="Join Us"
        image="/Children.png"
        href="/Register"
      />
    </div>
  );
}
