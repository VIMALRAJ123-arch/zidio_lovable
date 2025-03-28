"use client"

// Create a simple context for drag and drop
const DragDropContext = ({ children, onDragEnd }) => {
  const handleDragEnd = (result) => {
    if (onDragEnd) {
      onDragEnd(result)
    }
  }

  return (
    <div className="drag-drop-context" data-drag-drop-context>
      {children}
    </div>
  )
}

// Simple droppable area
const Droppable = ({ children, droppableId }) => {
  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-muted/30")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-muted/30")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-muted/30")

    // Find the closest drag-drop-context
    const contextElement = e.currentTarget.closest("[data-drag-drop-context]")
    if (!contextElement) return

    // Get the dragged item ID
    const draggableId = e.dataTransfer.getData("draggableId")
    const sourceId = e.dataTransfer.getData("sourceId")

    // Find the onDragEnd function from the context
    const onDragEndFn = contextElement.__dragDropOnDragEnd

    if (onDragEndFn && draggableId) {
      onDragEndFn({
        draggableId,
        source: { droppableId: sourceId },
        destination: { droppableId },
      })
    }
  }

  return (
    <div
      className="min-h-[200px] rounded-md transition-colors duration-200"
      data-droppable-id={droppableId}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

// Simple draggable item
const Draggable = ({ children, draggableId, index }) => {
  const handleDragStart = (e) => {
    // Store the draggable ID and source droppable ID
    e.dataTransfer.setData("draggableId", draggableId)
    const sourceElement = e.currentTarget.closest("[data-droppable-id]")
    if (sourceElement) {
      const sourceId = sourceElement.getAttribute("data-droppable-id")
      e.dataTransfer.setData("sourceId", sourceId)
    }

    // Add a class to the dragged element
    e.currentTarget.classList.add("opacity-50")
  }

  const handleDragEnd = (e) => {
    // Remove the class when dragging ends
    e.currentTarget.classList.remove("opacity-50")
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing"
      data-draggable-id={draggableId}
      data-index={index}
    >
      {children}
    </div>
  )
}

export { DragDropContext, Droppable, Draggable }

