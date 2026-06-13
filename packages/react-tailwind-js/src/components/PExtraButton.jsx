import { useState, useCallback } from "react";
import { clsx } from "clsx";

export const PExtraButton = ({
    Logo,
    LogoScale = 1,
    Progress = 0,
    ShowProgress = false,
    IsEnabled = true,
    onClick,
    onContextMenu,
    className,
    ToolTip,
}) => {
    const disabled = !IsEnabled;
    const [isPressed, setIsPressed] = useState(false);
    const [_isHovered, setIsHovered] = useState(false);
    const [isVisible, _setIsVisible] = useState(true);

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
        (event) => {
            if (!disabled) onClick?.(event);
        },
        [disabled, onClick]
    );

    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            if (!disabled) onContextMenu?.(event);
        },
        [disabled, onContextMenu]
    );

    // 计算进度高度
    const progressHeight = ShowProgress ? Math.max(0, Math.min(100, Progress)) : 0;

    return (
        <button
            type="button"
            title={ToolTip}
            className={clsx(
                "relative w-10 h-10 rounded-full overflow-hidden",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                className
            )}
            style={{
                transform: isPressed ? "scale(0.92)" : isVisible ? "scale(1)" : "scale(0)",
                transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            disabled={disabled}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 背景层 */}
            <div
                className={clsx(
                    "absolute inset-0 rounded-full transition-colors duration-150",
                    isPressed ? "bg-blue-500" : "bg-blue-400"
                )}
                style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                }}
            />

            {/* 进度层 */}
            {ShowProgress && (
                <div
                    className="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-300"
                    style={{
                        height: `${progressHeight}%`,
                    }}
                />
            )}

            {/* 图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    className={clsx("transition-all duration-150", disabled ? "text-white/50" : "text-white")}
                    width={LogoScale * 16}
                    height={LogoScale * 16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                        transform: isPressed ? "scale(0.9)" : "scale(1)",
                        transition: "transform 80ms ease-out",
                    }}>
                    <path d={Logo} />
                </svg>
            </div>
        </button>
    );
};

export default PExtraButton;
