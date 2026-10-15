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
    <section aria-label={title}>
      <h2 className="mb-5 text-xl font-bold sm:text-2xl">{title}</h2>

      <dl>
        {specifications.map((specification, index) => (
          <div key={index} className="grid gap-2 border-b py-4 sm:grid-cols-[1fr_2fr]">
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
