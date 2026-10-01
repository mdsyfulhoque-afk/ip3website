import { ImageStreamHero } from "@/components/ui/image-stream-hero";

const IMAGES = [
  { src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg", alt: "Sunset Seascape" },
  { src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/hero_gradient/hero-gradients-01.png", alt: "Gradient Wash" },
  { src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/821d815affa6496c39cbdeeec7a84603.jpg", alt: "Cityscape Blend" },
  { src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/crimson_aura/crimson-aura-02.png", alt: "Crimson Aura" },
];

export default function HeroSection() {
  return (
    <ImageStreamHero
      images={IMAGES}
      cards={9}
      speed={18}
      axis={55}
      path={{
        perspective: 30,
        cardWidth: 18,
        cardHeight: 25,
        cardRadius: 0.4,
        birthHeight: 2.6,
        exitHeight: 46,
        railBirth: -11,
        railExit: 44,
        fan: 3.3,
        turnBirth: 6,
        turnExit: 28,
        stops: 24,
      }}
      className="h-[560px] w-full rounded-2xl border border-neutral-800 bg-neutral-950"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center pointer-events-none">
        <div className="px-6 pointer-events-auto">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your work,
            <br />
            front and centre.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-neutral-400">
          A hero that leads with the images instead of describing them.
        </p>
      </div>
    </ImageStreamHero>
  );
}

export { HeroSection };
