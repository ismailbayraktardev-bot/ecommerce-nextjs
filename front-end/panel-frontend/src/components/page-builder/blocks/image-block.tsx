import { ImageBlock } from '@/types/blocks';

interface ImageBlockRenderProps {
  block: ImageBlock;
}

export function ImageBlockRender({ block }: ImageBlockRenderProps) {
  const { src, alt, width, height, alignment, rounded } = block.props;

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div className={alignmentClasses[alignment]}>
      <img
        src={src}
        alt={alt}
        style={{ width, height }}
        className={`max-w-full h-auto ${rounded ? 'rounded-xl' : ''}`}
      />
    </div>
  );
}
