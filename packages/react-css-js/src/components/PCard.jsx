import { useState, useCallback, useRef } from "react";
import "./PCard.css";

export const PCard = ({
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
    const [isPressed, setIsPressed] = useState(false);
    const contentRef = useRef(null);

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
            className={`pcard ${className || ""}`}
            style={{
                borderRadius: `${CornerRadius}px`,
                boxShadow: isHovered
                    ? "0 4px 20px rgba(96, 165, 250, 0.4)"
                    : "0 4px 20px rgba(96, 165, 250, 0.1)",
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
                className={`pcard__content ${isSwapped ? "pcard__content--swapped" : ""}`}
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
