import { useState, useCallback } from "react";
import { clsx } from "clsx";

export interface PExtraTextButtonProps {
  /** 文本 */
  Text: string;
  /** 图标 (SVG path) */
  Logo?: string;
  /** 图标大小 */
  LogoScale?: number;
  /** 是否禁用 */
  IsEnabled?: boolean;
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 标题/提示 */
  ToolTip?: string;
}

export const PExtraTextButton: React.FC<PExtraTextButtonProps> = ({
  Text,
  Logo,
  LogoScale = 1,
  IsEnabled = true,
  onClick,
  className,
  ToolTip,
}) => {
  const disabled = !IsEnabled;
  const [isPressed, setIsPressed] = useState(false);
  const [_isHovered, setIsHovered] = useState(false);

  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsPressed(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) onClick?.(event);
    },
    [disabled, onClick],
  );

  return (
    <button
      type="button"
      title={ToolTip || Text}
      className={clsx(
        "relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full overflow-hidden",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
      style={{
        transform: isPressed ? "scale(0.96)" : "scale(1)",
        transition: "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 背景层 */}
      <div
        className={clsx(
          "absolute inset-0 rounded-full transition-colors duration-150",
          isPressed ? "bg-blue-500" : "bg-blue-400",
        )}
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* 图标 */}
      {Logo && (
        <svg
          className={clsx(
            "relative z-10 transition-all duration-150",
            disabled ? "text-white/50" : "text-white",
          )}
          width={LogoScale * 16}
          height={LogoScale * 16}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            transform: isPressed ? "scale(0.9)" : "scale(1)",
            transition: "transform 80ms ease-out",
          }}
        >
          <path d={Logo} />
        </svg>
      )}

      {/* 文本 */}
      <span
        className={clsx(
          "relative z-10 text-[16px] font-medium transition-colors duration-150",
          disabled ? "text-white/50" : "text-white",
        )}
      >
        {Text}
      </span>
    </button>
  );
};

export default PExtraTextButton;
