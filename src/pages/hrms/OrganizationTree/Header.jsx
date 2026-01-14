import { Search, Plus, Menu } from "lucide-react";

export default function Header({ onAddNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-lg font-semibold text-gray-900">
        Organization Tree
      </h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"
          />
          <input
            placeholder="Search Employee, Dept, Designation..."
            className="pl-10 pr-4 h-10 w-[420px] border border-gray-200 rounded-full text-sm"
          />
        </div>

        <button
          onClick={onAddNode}
          className="flex items-center gap-2 bg-purple-600 text-white
          px-5 h-10 rounded-full text-sm font-medium hover:bg-purple-700"
        >
          Add Node
          <Plus size={16} />
        </button>

        <button className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-lg text-purple-600 ">
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
}
