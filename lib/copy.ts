export type ProductCopy = {
  slug: string;
  tagline: string;
  story: string[];
  production: {
    title: string;
    intro: string;
    details: { label: string; value: string }[];
  };
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
    production: {
      title: "From working sketch to finished pin",
      intro: `The production proof translated the original silhouette into a 38 mm soft-enamel pin. The teal face was specified in PMS 325 C, surrounded by raised silver-tone metal, with a rubber clutch post on the back.`,
      details: [
        { label: "Finished height", value: "38 mm / 1.5 inches" },
        { label: "Enamel", value: "PMS 325 C soft enamel" },
        { label: "Metal", value: "Raised silver-tone linework" },
        { label: "Back", value: "Rubber clutch post" },
      ],
    },
    specs: [
      { label: "Size", value: `1.5"` },
      { label: "Color", value: "Single-tone teal enamel (PMS 325C)" },
      { label: "Plating", value: "Silver-tone metal" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Soft enamel, die-struck" },
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
      `Roxie is based on the soft-sided rollaboard that crew members and frequent flyers actually carry: exterior pockets, a telescoping handle, side hardware, and the unmistakable upright silhouette seen on every jet bridge.`,
      `The artwork was stripped of logos and branding so the shape could do all the talking. Black enamel fills the bag while raised silver-tone metal traces the seams, pockets, wheels, zipper pull, and handle. The space inside the telescoping handle is physically cut out, so the garment or bag beneath the pin shows through.`,
      `It is a small tribute to the carry-on that is always packed, never volunteered at the gate, and somehow still rolling after a thousand trips.`,
    ],
    production: {
      title: "Designed like the real carry-on",
      intro: `The production proof set Roxie at 38 × 22 mm and converted the handle opening into a true cutout rather than printed enamel. Black soft enamel forms the body, raised silver-tone metal defines the pocket and hardware details, and a rubber clutch post keeps the pin secure.`,
      details: [
        { label: "Finished size", value: "38 × 22 mm / 1.5 inches tall" },
        { label: "Handle", value: "True open cutout—no enamel fill" },
        { label: "Enamel", value: "Black soft enamel" },
        { label: "Back", value: "Rubber clutch post" },
      ],
    },
    specs: [
      { label: "Size", value: `1.5" tall` },
      { label: "Color", value: "Black enamel with silver-tone linework" },
      { label: "Handle", value: "Open metal cutout" },
      { label: "Backing", value: "Rubber clutch back" },
      { label: "Style", value: "Soft enamel, die-struck" },
    ],
    images: {
      hero: "/images/roxie-carry-on-hero.jpg",
      scenes: [
        { src: "/images/roxie-carry-on-ai-passport.jpg", alt: "Roxie the Carry-On pin on a passport cover" },
        { src: "/images/roxie-carry-on-ai-luggagetag.jpg", alt: "Roxie the Carry-On pin on a fabric luggage tag" },
        { src: "/images/roxie-carry-on-ai-quarter.jpg", alt: "Roxie the Carry-On pin next to a quarter for size reference" },
        { src: "/images/roxie-carry-on-ai-inhand.jpg", alt: "Roxie the Carry-On pin held in a hand for scale" },
      ],
    },
  },
};
