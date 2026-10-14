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
    <section>
      <h2>{title}</h2>

      <dl>
        {specifications.map((specification, index) => (
          <div key={index} className="border-b py-3">
            <dt className="font-semibold">{specification.label}</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words">
              {specification.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}