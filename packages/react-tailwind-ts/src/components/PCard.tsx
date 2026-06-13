import { useState, useCallback, useRef } from "react";
import { clsx } from "clsx";

export interface PCardProps {
    /** 标题 */
    Title?: string;
    /** 是否可折叠 */
    CanSwap?: boolean;
    /** 是否已折叠 */
    IsSwapped?: boolean;
    /** 折叠高度 */
    SwapedHeight?: number;
    /** 子内容 */
    children?: React.ReactNode;
    /** 是否禁用鼠标动画 */
    HasMouseAnimation?: boolean;
    /** 圆角 */
    CornerRadius?: number;
    /** 自定义类名 */
    className?: string;
    /** 折叠状态变更事件 */
    onSwap?: (isSwapped: boolean) => void;
}

export const PCard: React.FC<PCardProps> = ({
    Title,
    CanSwap = false,
    IsSwapped: controlledSwapped,
    SwapedHeight = 40,
    children,
    HasMouseAnimation = true,
    CornerRadius = 5,
    className,
    onSwap,
}) => {
    const [internalSwapped, setInternalSwapped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [_isPressed, setIsPressed] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const isSwapped = controlledSwapped !== undefined ? controlledSwapped : internalSwapped;
    const showSwapArrow = CanSwap || children !== undefined;

    const handleToggleSwap = useCallback(() => {
        if (!showSwapArrow) return;

        const newState = !isSwapped;
        if (controlledSwapped === undefined) {
            setInternalSwapped(newState);
        }
        onSwap?.(newState);
    }, [isSwapped, showSwapArrow, controlledSwapped, onSwap]);

    const handleMouseEnter = useCallback(() => {
        if (HasMouseAnimation) setIsHovered(true);
    }, [HasMouseAnimation]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setIsPressed(false);
    }, []);

    const handleMouseDown = useCallback(() => {
        setIsPressed(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsPressed(false);
    }, []);

    return (
        <div
            className={clsx("relative overflow-hidden transition-all duration-300", "bg-white/50 backdrop-blur-sm", className)}
            style={{
                borderRadius: `${CornerRadius}px`,
                boxShadow: isHovered
                    ? "0 4px 20px rgba(96, 165, 250, 0.4)" // 蓝色阴影
                    : "0 4px 20px rgba(96, 165, 250, 0.1)", // 淡蓝色阴影
                height: isSwapped ? `${SwapedHeight}px` : "auto",
                minHeight: isSwapped ? `${SwapedHeight}px` : undefined,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 标题栏 */}
            <div
                className={clsx("flex items-center justify-between px-4 py-3", showSwapArrow && "cursor-pointer")}
                onClick={showSwapArrow ? handleToggleSwap : undefined}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                {Title && (
                    <span
                        className={clsx(
                            "text-[13px] font-bold transition-colors duration-200",
                            isHovered ? "text-blue-500" : "text-blue-400"
                        )}>
                        {Title}
                    </span>
                )}

                {/* 折叠箭头 */}
                {showSwapArrow && (
                    <svg
                        className={clsx(
                            "w-3 h-3 transition-all duration-250 shrink-0 ml-2",
                            isHovered ? "text-blue-500" : "text-blue-400"
                        )}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{
                            transform: isSwapped ? "rotate(-90deg)" : "rotate(0deg)",
                            transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                        }}>
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                )}
            </div>

            {/* 内容区域 */}
            <div
                ref={contentRef}
                className={clsx("px-4 pb-4 transition-all duration-300", isSwapped && "opacity-0 pointer-events-none")}
                style={{
                    maxHeight: isSwapped ? 0 : "none",
                    overflow: isSwapped ? "hidden" : "visible",
                }}>
                {children}
            </div>
        </div>
    );
};

export default PCard;
