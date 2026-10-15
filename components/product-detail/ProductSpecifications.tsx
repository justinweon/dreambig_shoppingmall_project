import type { ProductDetailData } from "@/util/types/detail";

interface ProductSpecificationsProps {
  title: string;
  specifications: ProductDetailData["specifications"];
}

export default function ProductSpecifications({ title, specifications }: ProductSpecificationsProps) {
  if (specifications.length === 0) {
    return null;
  }

  return (
    <section id="product-specifications" aria-label={title} className="ysh-detail-specs">
      <h2>{title}</h2>

      <ul className="ysh-spec-list">
        {specifications.map((specification, index) => (
          <li key={index}>
            <strong>{specification.label}</strong>
            <span className="whitespace-pre-wrap break-words">
              {specification.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
