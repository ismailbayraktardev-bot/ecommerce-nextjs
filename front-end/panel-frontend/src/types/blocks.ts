/**
 * Block Types and Interfaces
 * Defines all block types and their properties for the page builder
 */

export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'spacer';

export interface BlockBase {
  id: string;
  type: BlockType;
  order: number;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  props: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    alignment: 'left' | 'center' | 'right';
    color?: string;
  };
}

export interface TextBlock extends BlockBase {
  type: 'text';
  props: {
    text: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    fontSize?: string;
    color?: string;
  };
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  props: {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    alignment: 'left' | 'center' | 'right';
    rounded?: boolean;
  };
}

export interface ButtonBlock extends BlockBase {
  type: 'button';
  props: {
    text: string;
    href: string;
    variant: 'primary' | 'secondary' | 'outline';
    alignment: 'left' | 'center' | 'right';
    size: 'sm' | 'md' | 'lg';
  };
}

export interface SpacerBlock extends BlockBase {
  type: 'spacer';
  props: {
    height: string;
  };
}

export type Block = HeadingBlock | TextBlock | ImageBlock | ButtonBlock | SpacerBlock;

export interface PageContent {
  blocks: Block[];
}

// Block templates for easy creation
export const createBlock = {
  heading: (order: number): HeadingBlock => ({
    id: `heading-${Date.now()}-${Math.random()}`,
    type: 'heading',
    order,
    props: {
      text: 'Yeni Başlık',
      level: 2,
      alignment: 'left',
    },
  }),

  text: (order: number): TextBlock => ({
    id: `text-${Date.now()}-${Math.random()}`,
    type: 'text',
    order,
    props: {
      text: 'Yeni metin bloğu. Buraya içeriğinizi yazın.',
      alignment: 'left',
    },
  }),

  image: (order: number): ImageBlock => ({
    id: `image-${Date.now()}-${Math.random()}`,
    type: 'image',
    order,
    props: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'Placeholder image',
      alignment: 'center',
      rounded: false,
    },
  }),

  button: (order: number): ButtonBlock => ({
    id: `button-${Date.now()}-${Math.random()}`,
    type: 'button',
    order,
    props: {
      text: 'Tıkla',
      href: '#',
      variant: 'primary',
      alignment: 'center',
      size: 'md',
    },
  }),

  spacer: (order: number): SpacerBlock => ({
    id: `spacer-${Date.now()}-${Math.random()}`,
    type: 'spacer',
    order,
    props: {
      height: '40px',
    },
  }),
};
