/**
 * Block Renderer
 * Renders different block types based on their type
 */

import { Block } from '@/types/blocks';
import { HeadingBlockRender } from './heading-block';
import { TextBlockRender } from './text-block';
import { ImageBlockRender } from './image-block';
import { ButtonBlockRender } from './button-block';
import { SpacerBlockRender } from './spacer-block';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onClick: () => void;
}

export function BlockRenderer({ block, isSelected, onClick }: BlockRendererProps) {
  const wrapperClass = `
    relative group cursor-pointer transition-all duration-200
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}
  `;

  return (
    <div className={wrapperClass} onClick={onClick}>
      {block.type === 'heading' && <HeadingBlockRender block={block} />}
      {block.type === 'text' && <TextBlockRender block={block} />}
      {block.type === 'image' && <ImageBlockRender block={block} />}
      {block.type === 'button' && <ButtonBlockRender block={block} />}
      {block.type === 'spacer' && <SpacerBlockRender block={block} />}

      {/* Block Type Badge */}
      <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-block px-2 py-1 bg-gray-900 text-white text-xs rounded-br-lg">
          {block.type}
        </span>
      </div>
    </div>
  );
}
