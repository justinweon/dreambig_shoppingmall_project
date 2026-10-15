import type { DetailTemplate, ProductDetailData } from "@/util/types/detail";

export function getVisibleDetailSections(template: DetailTemplate, data: Pick<ProductDetailData, "features" | "specifications">) {
  return template.sections.filter((section) => {
    if (section.kind === "features") return data.features.length > 0;
    if (section.kind === "specifications") return data.specifications.length > 0;
    return true;
  });
}

export function getSectionAnchor(section: DetailTemplate["sections"][number]) {
  return `product-${section.id}`;
}
