import { SpacerBlock } from '@/types/blocks';

interface SpacerBlockRenderProps {
  block: SpacerBlock;
}

export function SpacerBlockRender({ block }: SpacerBlockRenderProps) {
  const { height } = block.props;

  return (
    <div
      style={{ height }}
      className="border-2 border-dashed border-gray-200"
    />
  );
}
