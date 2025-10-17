import { TextBlock } from '@/types/blocks';

interface TextBlockRenderProps {
  block: TextBlock;
}

export function TextBlockRender({ block }: TextBlockRenderProps) {
  const { text, alignment, fontSize, color } = block.props;

  return (
    <p
      className={`text-${alignment}`}
      style={{ fontSize, color }}
    >
      {text}
    </p>
  );
}
