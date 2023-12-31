"use client";
import SectionTitle from "../components/section-title";
import featuresData from "./feature-data";
import SingleFeature from "./single-feature";

const Features = () => {
  return (
    <>
      <section
        id="features"
        className="bg-purple/[.03] py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <SectionTitle title="Main Features" paragraph="" center />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
