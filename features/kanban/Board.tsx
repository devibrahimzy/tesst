"use client"

import { useEffect } from "react"
import { useKanbanStore } from "./kanban.store"
import { kanbanService } from "./kanban.service"
import { BacklogItem } from "../backlog/backlog.types"

const COLUMNS = [
  { id: "TODO", name: "To Do", color: "bg-gray-100" },
  { id: "IN_PROGRESS", name: "In Progress", color: "bg-blue-100" },
  { id: "DONE", name: "Done", color: "bg-green-100" }
]

export default function Board({ sprintId }: { sprintId: string }) {
  const { boardItems, setBoardItems, loading, setLoading } = useKanbanStore()

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true)
        const items = await kanbanService.getBoard(sprintId)
        setBoardItems(items)
      } catch (error) {
        console.error("Failed to fetch board", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBoard()
  }, [sprintId, setBoardItems, setLoading])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading board...</div>
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnItems = boardItems.filter(item => item.status === column.id)

        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{column.name}</h3>
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                  {columnItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnItems.map((item: BacklogItem) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {item.type}
                      </span>
                      {item.story_points > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          {item.story_points} pts
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-2">{item.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Priority: {item.priority}</span>
                      {item.assigned_to_id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
                {columnItems.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No items
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
