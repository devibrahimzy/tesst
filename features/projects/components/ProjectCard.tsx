import Link from "next/link"
import { Project } from "../projects.types"

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{project.description || "No description"}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {project.status}
        </span>
        <span>{project.isActive ? "Active" : "Inactive"}</span>
      </div>
    </Link>
  )
}
