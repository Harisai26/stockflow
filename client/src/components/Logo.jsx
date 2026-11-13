import { Box } from "lucide-react";

const Logo = ({ dark = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
        <Box size={24} />
      </div>
      <span
        className={`text-2xl font-bold ${dark ? "text-slate-900" : "text-white"}`}
      >
        StockFlow
      </span>
    </div>
  );
};

export default Logo;
