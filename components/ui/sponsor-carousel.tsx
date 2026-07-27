import type { FC } from 'react';
import CarouselRow from './carousel-row';

interface Logo {
  id: string | number;
  src: string;
  alt: string;
  hint: string;
}

interface SponsorCarouselProps {
  rows: Logo[][];
  defaultAnimationDuration?: string;
}

const SponsorCarousel: FC<SponsorCarouselProps> = ({ rows, defaultAnimationDuration = "60s" }) => {
  if (!rows || rows.length === 0) {
    return <p>No sponsors to display.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {rows.map((logos, index) => (
        <CarouselRow
          key={`row-${index}`}
          logos={logos}
          direction={index % 2 === 0 ? 'forward' : 'backward'}
          animationDuration={defaultAnimationDuration}
        />
      ))}
    </div>
  );
};

export default SponsorCarousel;