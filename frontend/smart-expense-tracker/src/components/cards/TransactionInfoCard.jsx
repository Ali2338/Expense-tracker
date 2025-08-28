import React from "react";
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100/60 w-full">
      {/* Icon */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-lg text-gray-800 bg-gray-100 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <LuUtensils />
        )}
      </div>

      {/* Middle: Title + Date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">{title}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      {/* Right side: Amount + Delete */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Amount */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${getAmountStyles()}`}
        >
          {type === "income" ? "+" : "-"} {amount}
          {type === "income" ? <LuTrendingUp size={14} /> : <LuTrendingDown size={14} />}
        </div>

        {/* Delete button (only visible on hover, hidden on mobile hover not required) */}
        {!hideDeleteBtn && (
          <button
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={onDelete}
          >
            <LuTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
