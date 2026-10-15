import Image from "next/image";
import type { ProductFeature } from "@/util/types/detail";

export default function ProductFeatures({ id, title, features }: { id: string; title: string; features: readonly ProductFeature[] }) {
  if (!features.length) return null;
  return <section id={id} aria-label={title} className="ysh-detail-features">
    <h2 className="sr-only">{title}</h2>
    <ul className="ysh-feature-list">
      {features.map((feature) => <li key={feature.id} className="ysh-feature">
        <div className="ysh-feature-copy"><h3>{feature.title}</h3>
          <ul>{feature.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
        <Image src={feature.image.src} alt={feature.image.alt} width={1000} height={1000}
          sizes="(min-width: 1024px) 600px, 100vw" className="ysh-feature-image" />
      </li>)}
    </ul>
  </section>;
}
