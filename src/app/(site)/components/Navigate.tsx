import CardWithAnimatedButton from "./CardWithAnimatedButton";

export default function Navigate() {
  return (
    <div className="flex flex-col gap-3 p-3 md:flex-row">
      <CardWithAnimatedButton
        text="Reviews"
        image="/siteimages/Childrenclasroomactivity.webp"
        href="https://www.yelp.com/biz/stepping-stone-world-milpitas?osq=Stepping+Stone+world+preschool"
      />
      <CardWithAnimatedButton
        text="Our Values"
        image="/siteimages/ChildrenGraduation.webp"
        href="/AboutUs"
      />
      <CardWithAnimatedButton
        text="Join Us"
        image="/siteimages/Children.webp"
        href="/Register"
      />
    </div>
  );
}
