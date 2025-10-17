import { ButtonBlock } from '@/types/blocks';
import { Button } from '@/components/ui/button';

interface ButtonBlockRenderProps {
  block: ButtonBlock;
}

export function ButtonBlockRender({ block }: ButtonBlockRenderProps) {
  const { text, href, variant, alignment, size } = block.props;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <div className={`flex ${alignmentClasses[alignment]}`}>
      <a href={href} className="inline-block">
        <button
          className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]}`}
        >
          {text}
        </button>
      </a>
    </div>
  );
}
