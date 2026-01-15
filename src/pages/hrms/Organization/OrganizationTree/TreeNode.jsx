import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";

export default function TreeNode({
    name,
    role,
    avatar,
    expanded = false,
    children,
}) {
    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <div className="flex gap-2 items-center">
                    {children ? (
                        expanded ? (
                            <ChevronDown size={18} className="text-gray-500" />
                        ) : (
                            <ChevronRight size={18} className="text-gray-500" />
                        )
                    ) : (
                        <div className="w-[18px]" />
                    )}

                    <div className="flex items-center gap-3">
                        <img
                            src={avatar || "/images/girl_orga.svg"}
                            alt={name}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>

                <MoreVertical
                    size={16}
                    className="text-purple-600 cursor-pointer"
                />
            </div>

            {children}
        </div>
    );
}