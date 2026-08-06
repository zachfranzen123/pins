export type ProductCopy = {
  slug: string;
  tagline: string;
  story: string[];
  specs: { label: string; value: string }[];
  images: {
    hero: string;
    scenes: { src: string; alt: string }[];
  };
};

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  "layover-larry": {
    slug: "layover-larry",
    tagline: "Your co-pilot for every delay, deice, and dead layover.",
    story: [
      `Every crew has that one tool that's seen it all — the one that's chipped the ice off a beverage cart at 4am, propped open a jet bridge door, and generally been there for the worst three-hour sits of your career. Ours is named Larry.`,
      `Layover Larry is built the way the real thing is: a stout mallet head on a long ribbed handle you can actually get a grip on, cast in a single confident teal. He doesn't do subtle — he's the pin equivalent of the coworker who cracks a joke right when the delay board flips to "3+ hours."`,
      `Clip him to a lanyard, a jacket, or a headset bag and he's a quiet nod to everyone who's ever powered through a layover that ran long.`,
    ],
    specs: [
      { label: "Size", value: `1.5"` },
      { label: "Color", value: "Single-tone teal enamel (PMS 325C)" },
      { label: "Plating", value: "Silver-tone metal" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Hard enamel, die-struck" },
    ],
    images: {
      hero: "/images/layover-larry-hero.jpg",
      scenes: [
        { src: "/images/layover-larry-ai-denim.jpg", alt: "Layover Larry pin on a denim jacket" },
        { src: "/images/layover-larry-ai-beanie.jpg", alt: "Layover Larry pin on a knit beanie" },
        { src: "/images/layover-larry-ai-tote.jpg", alt: "Layover Larry pin on a canvas tote bag" },
        { src: "/images/layover-larry-ai-backpack.jpg", alt: "Layover Larry pin on a backpack pocket" },
        { src: "/images/layover-larry-ai-quarter.jpg", alt: "Layover Larry pin next to a quarter for size reference" },
        { src: "/images/layover-larry-ai-inhand.jpg", alt: "Layover Larry pin held in a hand for scale" },
      ],
    },
  },
  "roxie-carry-on": {
    slug: "roxie-carry-on",
    tagline: "Wheels up. Always.",
    story: [
      `Roxie is the carry-on that's made every gate on time — scuffed corners, one sticky wheel, and a silhouette you'd know from across the terminal. She's the bag every road warrior and crew member has dragged through a thousand jet bridges.`,
      `We drew her in a single confident black with clean silver linework, right down to the telescoping handle and the little zipper pull on the front pocket. No logos, no branding — just the shape everyone recognizes on sight.`,
      `A small tribute to the bag that's never once let you check it.`,
    ],
    specs: [
      { label: "Size", value: `1.5"` },
      { label: "Color", value: "Black enamel with silver-tone linework" },
      { label: "Plating", value: "Silver-tone metal" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Hard enamel, die-struck" },
    ],
    images: {
      hero: "/images/roxie-carry-on-hero.jpg",
      scenes: [
        { src: "/images/roxie-carry-on-ai-suitcase.jpg", alt: "Roxie the Carry-On pin on an actual rolling suitcase" },
        { src: "/images/roxie-carry-on-ai-passport.jpg", alt: "Roxie the Carry-On pin on a passport cover" },
        { src: "/images/roxie-carry-on-ai-luggagetag.jpg", alt: "Roxie the Carry-On pin on a leather luggage tag" },
        { src: "/images/roxie-carry-on-ai-inbox.jpg", alt: "Roxie the Carry-On pin in its gift packaging" },
        { src: "/images/roxie-carry-on-ai-quarter.jpg", alt: "Roxie the Carry-On pin next to a quarter for size reference" },
        { src: "/images/roxie-carry-on-ai-inhand.jpg", alt: "Roxie the Carry-On pin held in a hand for scale" },
      ],
    },
  },
};
