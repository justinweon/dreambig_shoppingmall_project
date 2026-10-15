# 담당 영역 이미지 기록

기존 shared/asset의 각 상품 이미지를 확인한 후 `util/data/productMedia.ts`에서 갤러리, 설명, hover, 후기 용도로 구분했다. 상품별 추가 사진이 없는 용도는 생략했으며 같은 사진을 다른 연출 사진처럼 반복하지 않았다. 캐러셀 대표 사진과 상세 대표 사진은 같은 상품 식별용으로 공유한다.

배너에 적합한 넓은 구도의 사진은 별도로 제작했다. 내장 imagegen 도구를 사용했으며 아래 원본 키링 사진을 제품 정체성 참고로 전달했다. 다른 사이트 사진은 내려받거나 사용하지 않았다.

- 결과: `public/images/sejong-keyring-hero.png`
- 참고: `shared/asset/sejong_key_ring_1.png`
- 용도: 메인 배너 전용, 실제 판매 사양이나 실물 사진을 보증하지 않는 연출 이미지
- 제작: 2026-10-15

## 생성 프롬프트

```text
Create a NEW original photorealistic ecommerce hero photo, landscape 16:9, using the attached image only as product identity reference. The product is the clear acrylic keyring depicting the cute seated Korean King Sejong in a black royal hat and red robe holding a gray laptop. Preserve its design, proportions, colors and silver split ring. Show ONE keyring hanging from a cream canvas tote on a wooden desk, product centered horizontally in the LOWER HALF, fully visible, medium shot (not huge cropped closeup). Background: softly defocused warm Korean study room, subtle wood and cream textiles. TOP 45 percent is quiet darker slate/warm brown bokeh negative space with NO objects, suitable for centered white headline and two buttons added later in HTML. Premium realistic product photography, natural materials, soft directional daylight, clean editorial composition. No typography, no letters, no watermark, no extra products, no collage, no UI, no border. This is a distinct wide hero scene, not a crop or enlargement of the supplied square photo.
```

레이아웃 참고: https://xbotgo.com/ 와 https://xbotgo.com/products/xbotgo-t4-tripod-set-aluminum-alloy-13ft
