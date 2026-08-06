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
      { label: "Size", value: `1.5" tall — true to the size guide, not inflated for the listing photo` },
      { label: "Color", value: "Single-tone teal enamel (PMS 325C)" },
      { label: "Plating", value: "Silver-tone metal" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Hard enamel, die-struck" },
    ],
    images: {
      hero: "/images/layover-larry-hero.jpg",
      scenes: [
        { src: "/images/layover-larry-jacket.jpg", alt: "Layover Larry pin on a denim jacket lapel, shown at true 1.5\" scale" },
        { src: "/images/layover-larry-tote.jpg", alt: "Layover Larry pin on a canvas tote bag, shown at true 1.5\" scale" },
        { src: "/images/layover-larry-cap.jpg", alt: "Layover Larry pin on a cap front panel, shown at true 1.5\" scale" },
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
      { label: "Size", value: `1.5" tall — true to the size guide, not inflated for the listing photo` },
      { label: "Color", value: "Black enamel with silver-tone linework" },
      { label: "Plating", value: "Silver-tone metal" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Hard enamel, die-struck" },
    ],
    images: {
      hero: "/images/roxie-carry-on-hero.jpg",
      scenes: [
        { src: "/images/roxie-carry-on-jacket.jpg", alt: "Roxie the Carry-On pin on a denim jacket lapel, shown at true 1.5\" scale" },
        { src: "/images/roxie-carry-on-tote.jpg", alt: "Roxie the Carry-On pin on a canvas tote bag, shown at true 1.5\" scale" },
        { src: "/images/roxie-carry-on-cap.jpg", alt: "Roxie the Carry-On pin on a cap front panel, shown at true 1.5\" scale" },
      ],
    },
  },
};
