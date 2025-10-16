"use client"

import { DndContext, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function Draggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'box' })
  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="h-20 w-20 rounded-lg bg-black text-white"
    >
      Drag me
    </button>
  )
}

export default function DnDPlayground() {
  return (
    <main className="container py-10">
      <h1 className="text-xl font-semibold">D&D Playground</h1>
      <div className="mt-6">
        <DndContext>
          <Draggable />
        </DndContext>
      </div>
    </main>
  )
}
