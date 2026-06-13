import { useState, useCallback, useRef } from "react";
import "./PCard.css";

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
            className={`pcard ${isHovered ? "pcard--hovered" : ""} ${className || ""}`}
            style={{
                borderRadius: `${CornerRadius}px`,
                height: isSwapped ? `${SwapedHeight}px` : "auto",
                minHeight: isSwapped ? `${SwapedHeight}px` : undefined,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 标题栏 */}
            <div
                className={`pcard__header ${showSwapArrow ? "pcard__header--clickable" : ""}`}
                onClick={showSwapArrow ? handleToggleSwap : undefined}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                {Title && (
                    <span className={`pcard__title ${isHovered ? "pcard__title--hovered" : ""}`}>
                        {Title}
                    </span>
                )}

                {/* 折叠箭头 */}
                {showSwapArrow && (
                    <svg
                        className={`pcard__arrow ${isHovered ? "pcard__arrow--hovered" : ""}`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{
                            transform: isSwapped ? "rotate(-90deg)" : "rotate(0deg)",
                        }}>
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                )}
            </div>

            {/* 内容区域 */}
            <div
                ref={contentRef}
                className={`pcard__content ${isSwapped ? "pcard__content--swapped" : ""}`}>
                {children}
            </div>
        </div>
    );
};

export default PCard;
