import { useState, useCallback } from "react";
import { clsx } from "clsx";

export interface PListItemProps {
    /** 标题 */
    Title: string;
    /** 信息/副标题 */
    Info?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否选中 */
    Checked?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: () => void;
    /** 自定义类名 */
    className?: string;
}

export const PListItem: React.FC<PListItemProps> = ({
    Title,
    Info,
    Logo,
    Checked = false,
    IsEnabled = true,
    onClick,
    className,
}) => {
    const disabled = !IsEnabled;
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = useCallback(() => {
        if (!disabled) onClick?.();
    }, [disabled, onClick]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setIsPressed(false);
    }, []);

    const handleMouseDown = useCallback(() => {
        if (!disabled) setIsPressed(true);
    }, [disabled]);

    const handleMouseUp = useCallback(() => {
        setIsPressed(false);
    }, []);

    return (
        <div
            className={clsx(
                "flex items-center h-10.5 px-2 rounded-[3px] transition-all duration-150",
                "cursor-pointer select-none",
                disabled && "cursor-not-allowed opacity-50",
                isHovered && !disabled && "bg-blue-50",
                className
            )}
            style={{
                transform: isPressed ? "scale(0.995)" : "scale(1)",
                transition: "transform 80ms ease-out, background-color 150ms",
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            {/* 左侧指示条 */}
            <div
                className={clsx(
                    "w-0.5 h-6 rounded-full mr-2 transition-all duration-200",
                    Checked ? "bg-blue-400" : "bg-transparent"
                )}
            />

            {/* 图标 */}
            {Logo && (
                <svg
                    className={clsx(
                        "w-4 h-4 mr-3 shrink-0 transition-colors duration-150",
                        Checked ? "text-blue-400" : "text-gray-400",
                        isHovered && !disabled && !Checked && "text-blue-300"
                    )}
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {/* 内容区域 */}
            <div className="flex-1 min-w-0">
                <div
                    className={clsx(
                        "text-[14px] truncate transition-colors duration-150",
                        Checked ? "text-blue-500 font-medium" : "text-gray-700",
                        isHovered && !disabled && !Checked && "text-blue-400"
                    )}>
                    {Title}
                </div>
                {Info && <div className="text-[12px] text-gray-400 truncate">{Info}</div>}
            </div>
        </div>
    );
};

export default PListItem;
