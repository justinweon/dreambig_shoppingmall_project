import type { ProductDetailData } from "@/util/types/detail";

interface ProductSpecificationsProps {
  id: string;
  title: string;
  specifications: ProductDetailData["specifications"];
}

export default function ProductSpecifications({ id, title, specifications }: ProductSpecificationsProps) {
  if (specifications.length === 0) {
    return null;
  }

  return (
    <section id={id} aria-label={title} className="productdetailpage-detail-specs">
      <h2>{title}</h2>

      <ul className="productdetailpage-spec-list">
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
