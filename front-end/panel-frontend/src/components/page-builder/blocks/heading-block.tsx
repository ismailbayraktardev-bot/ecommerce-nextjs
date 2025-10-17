import { HeadingBlock } from '@/types/blocks';

interface HeadingBlockRenderProps {
  block: HeadingBlock;
}

export function HeadingBlockRender({ block }: HeadingBlockRenderProps) {
  const { text, level, alignment, color } = block.props;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  };

  return (
    <Tag
      className={`font-bold ${sizeClasses[level]} text-${alignment}`}
      style={{ color }}
    >
      {text}
    </Tag>
  );
}
