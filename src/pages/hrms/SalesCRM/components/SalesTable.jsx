import { StatusBadge } from "./SalesUi";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function SalesTable({ rows, columns = ["Name", "Company", "Status", "Owner", "Value", "Next Action"], renderActions }) {
  const cellKeys = ["name", "company", "status", "owner", "value", "source", "next"];
  const dataColumnCount = renderActions ? columns.length - 1 : columns.length;

  return (
    <div className="overflow-hidden rounded-lg border border-[#E4E0E0]">
      <div className="overflow-x-auto">
        <table className="min-w-[880px] w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs uppercase tracking-[0.08em] text-[#667085]">
            <tr>
              {columns.map((head) => (
                <th key={head} className="px-5 py-4 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.map((row) => (
              <tr key={row.id ?? `${row.name}-${row.company}`} className="bg-white text-[#667085]">
                {cellKeys.slice(0, dataColumnCount).map((key) => (
                  <td
                    key={`${row.id}-${key}`}
                    className={cx(
                      "px-5 py-4",
                      (key === "name" || key === "value") && "font-semibold text-[#333333]",
                    )}
                  >
                    {key === "status" ? <StatusBadge label={row.status} /> : row[key] ?? "—"}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-5 py-4">{renderActions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
