import type { Vinyl } from "../types";

export interface VinylReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  setup: string;
  pressing: string;
  helpful: number;
  postedAt: string;
}

const reviewTemplates = [
  {
    author: "warm_groove",
    rating: 5,
    title: "공간감이 좋아서 앨범을 다시 듣게 됐어요",
    body: "스트리밍으로 들을 때보다 악기 사이의 여백이 잘 느껴졌습니다. 조용한 밤에 한 면씩 듣기 좋았어요.",
    setup: "AT-LP120X · 액티브 스피커",
    helpful: 18,
  },
  {
    author: "side_a",
    rating: 4,
    title: "소리는 만족, 자켓 마감은 조금 아쉬워요",
    body: "재생 노이즈는 거의 없고 저역도 안정적입니다. 다만 자켓 모서리가 약해서 보관 슬리브는 꼭 필요해 보여요.",
    setup: "Debut Carbon EVO · 2채널",
    helpful: 11,
  },
  {
    author: "first_pressing",
    rating: 5,
    title: "처음부터 끝까지 집중해서 듣기 좋은 판",
    body: "트랙 순서와 면 전환이 자연스러워 앨범 단위 감상에 잘 맞습니다. 소장 만족도가 높은 판본이에요.",
    setup: "Planar 1 · 북셀프 스피커",
    helpful: 24,
  },
  {
    author: "quiet_surface",
    rating: 4,
    title: "프레싱 상태가 깨끗하고 밸런스가 좋습니다",
    body: "첫 세척 후 들었는데 표면 잡음이 적었습니다. 보컬과 중심 악기가 또렷하게 들리는 편이에요.",
    setup: "AT-LP60X · 유선 연결",
    helpful: 9,
  },
  {
    author: "crate_digger",
    rating: 5,
    title: "커버와 바이닐을 함께 보는 재미가 있어요",
    body: "패키지 구성이 앨범 분위기와 잘 맞고 실제로 꺼내 들을 때 만족감이 큽니다.",
    setup: "SL-1200MK7 · 인티앰프",
    helpful: 15,
  },
];

const hashText = (value: string) =>
  [...value].reduce((hash, character) => hash + character.charCodeAt(0), 0);

export const getVinylReviews = (vinyl: Vinyl): VinylReview[] => {
  const offset = hashText(vinyl.id) % reviewTemplates.length;
  return Array.from({ length: 3 }, (_, index) => {
    const template = reviewTemplates[(offset + index) % reviewTemplates.length];
    return {
      ...template,
      id: `${vinyl.id}-review-${index}`,
      pressing: vinyl.pressing,
      postedAt: index === 0 ? "3일 전" : index === 1 ? "2주 전" : "1개월 전",
    };
  });
};
