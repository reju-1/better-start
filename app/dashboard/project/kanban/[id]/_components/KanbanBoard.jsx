"use client";

import { COLUMN_CONFIG, TAG_COLORS } from "./kanbanConstants";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  tasks,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMN_CONFIG.map((column) => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          status={column.id}
          tasks={tasks[column.id] || []}
          count={tasks[column.id]?.length || 0}
          tagColors={TAG_COLORS}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          countBgColor={column.countBgColor}
          countTextColor={column.countTextColor}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;