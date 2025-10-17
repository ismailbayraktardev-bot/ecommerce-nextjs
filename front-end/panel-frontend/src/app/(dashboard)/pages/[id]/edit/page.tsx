"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePage, useUpdatePage } from "@/hooks/use-pages";
import { Button } from "@/components/ui/button";
import {
  Save,
  ArrowLeft,
  Eye,
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  MousePointer2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Block, createBlock, BlockType } from "@/types/blocks";
import { BlockRenderer } from "@/components/page-builder/blocks/block-renderer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onClick: () => void;
}

function SortableBlock({ block, isSelected, onClick }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BlockRenderer block={block} isSelected={isSelected} onClick={onClick} />
    </div>
  );
}

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const { data: page, isLoading } = usePage(pageId);
  const updatePage = useUpdatePage(pageId);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load blocks from page content
  useEffect(() => {
    if (page?.content && typeof page.content === "object") {
      const content = page.content as any;
      if (content.blocks && Array.isArray(content.blocks)) {
        setBlocks(content.blocks);
      }
    }
  }, [page]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock[type](blocks.length);
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const updateBlockProps = (id: string, newProps: any) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePage.mutateAsync({
        content: { blocks },
      });
      alert("Sayfa başarıyla kaydedildi!");
    } catch (error) {
      alert("Kaydetme hatası!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Sayfa bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/sites/${page.siteId}/pages`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{page.title}</h1>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Önizle
          </Button>
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Blocks Library */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Bloklar</h3>
          <div className="space-y-2">
            <button
              onClick={() => addBlock("heading")}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Type className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Başlık</span>
            </button>
            <button
              onClick={() => addBlock("text")}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Layout className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Metin</span>
            </button>
            <button
              onClick={() => addBlock("image")}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Resim</span>
            </button>
            <button
              onClick={() => addBlock("button")}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <MousePointer2 className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Buton</span>
            </button>
            <button
              onClick={() => addBlock("spacer")}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Square className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Boşluk</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 min-h-full">
            {blocks.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Soldaki blok kütüphanesinden sürükleyerek başlayın</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onClick={() => setSelectedBlockId(block.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
          {selectedBlock ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {selectedBlock.type.charAt(0).toUpperCase() +
                    selectedBlock.type.slice(1)}{" "}
                  Özellikleri
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-600"
                  onClick={() => deleteBlock(selectedBlock.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Heading Properties */}
              {selectedBlock.type === "heading" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metin
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.props.text}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seviye
                    </label>
                    <select
                      value={selectedBlock.props.level}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, {
                          level: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <key={level} value={level}>
                          H{level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Text Properties */}
              {selectedBlock.type === "text" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metin
                    </label>
                    <textarea
                      value={selectedBlock.props.text}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                    />
                  </div>
                </div>
              )}

              {/* Image Properties */}
              {selectedBlock.type === "image" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resim URL
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.props.src}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, { src: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Button Properties */}
              {selectedBlock.type === "button" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buton Metni
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.props.text}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.props.href}
                      onChange={(e) =>
                        updateBlockProps(selectedBlock.id, { href: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Bir blok seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
