import { cn } from '@/lib/utils';
import Image from 'next/image';
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: 'book-cover_extra_small',
  small: 'book-cover_small',
  medium: 'book-cover_medium',
  regular: 'book-cover_regular',
  wide: 'book-cover_wide',
};

interface BookCoverProps {
  variant?: BookCoverVariant;
  className?: string;
  coverColor: string;
  coverUrl: string;
}

export default function BookCover({
  coverColor = '#012B48',
  coverUrl = 'https://placehold.co/400x600.png',
  variant = 'regular',
  className,
}: BookCoverProps) {
  return (
    <div className={cn('relative transition-all duration-300', variantStyles[variant], className, 'text-light-200')}>
      <BookCoverSvg coverColor={coverColor} />
      <div className="absolute left-[12%] z-10 h-[88%] w-[87.5%]">
        <Image src={coverUrl} alt="Book cover" fill className="rounded-sm object-fill" />
      </div>
    </div>
  );
}
