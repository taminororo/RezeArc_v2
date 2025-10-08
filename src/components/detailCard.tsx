// ...existing code...
export type DetailCardProps = {
  title?: React.ReactNode; // 追加
  description?: string;
  className?: string;
  onClick?: () => void;
};

export default function DetailCard({
  title, // 追加
  description = "全ての企画の詳細情報と混雑状況をチェック",
  className = "",
  onClick,
}: DetailCardProps) {
  return (
    <div
      className={`
        w-full max-w-2xl 
        bg-[#fffdfa]
        rounded-2xl 
        p-4 
        ${className}
        relative
        border-[2px] border-[#434d6e]
      `}
      style={{
        boxShadow: "4px 4px 0 0 #434d6e", // 右下にだけ影
        position: "relative",
      }}
      onClick={onClick}
    >
      {title && (
        <div className="px-0 text-lg sm:text-lg font-semibold mt-6 mb-4">
          {title}
        </div>
      )}
      
      <p className="px-2 text-sm sm:text-lg text-black mb-6">
        {description}
      </p>
    </div>
  );
}