import Link from "next/link"
import { BacklogItem as BacklogItemType } from "./backlog.types"

const TYPE_COLORS: Record<string, string> = {
  USER_STORY: "bg-blue-100 text-blue-800",
  BUG: "bg-red-100 text-red-800",
  TASK: "bg-gray-100 text-gray-800"
}

const PRIORITY_LABELS: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Critical"
}

export default function BacklogItem({ item }: { item: BacklogItemType }) {
  return (
    <Link
      href={`/dashboard/projects/${item.project_id}`}
      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${TYPE_COLORS[item.type]}`}>
              {item.type}
            </span>
            {item.story_points > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                {item.story_points} pts
              </span>
            )}
          </div>
          <h3 className="font-medium mb-1">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.description || "No description"}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{PRIORITY_LABELS[item.priority] || "Low"}</span>
        </div>
      </div>
    </Link>
  )
}
