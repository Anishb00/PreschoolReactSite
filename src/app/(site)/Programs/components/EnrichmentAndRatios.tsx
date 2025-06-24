export default function EnrichmentAndRatios() {
  return (
    <section className="bg-white p-20">
      <div className="mb-12">
        <h3 className="mb-4 text-3xl font-semibold text-[#3B1FA8]">
          Enrichment Activities
        </h3>
        <ul className="list-inside list-disc space-y-1 text-base text-gray-700">
          <li>Music & Movement</li>
          <li>Arts & Crafts</li>
          <li>Beginner Spanish & Cultural Activities</li>
          <li>Gymnastics & Yoga</li>
          <li>Storytelling & Puppet Theater</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-3xl font-semibold text-[#3B1FA8]">
          Teacher-to-Child Ratios
        </h3>
        <ul className="list-inside list-disc space-y-1 text-base text-gray-700">
          <li>1:6 ratio for ages 2–3</li>
          <li>1:9 ratio for ages 3–5</li>
          <li>1:10 ratio for Kindergarten & Enrichment</li>
        </ul>
      </div>
    </section>
  );
}
