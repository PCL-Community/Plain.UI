import { useState, useCallback } from "react";
import { clsx } from "clsx";

export interface PIconButtonProps {
    /** 图标 (SVG path) */
    Logo: string;
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

export const PIconButton: React.FC<PIconButtonProps> = ({
    Logo,
    LogoScale = 1,
    IsEnabled = true,
    onClick,
    className,
    ToolTip,
}) => {
    const disabled = !IsEnabled;
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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
        [disabled, onClick]
    );

    // 背景颜色
    const getBackgroundColor = () => {
        if (disabled) return "bg-gray-100";
        if (isPressed) return "bg-blue-100";
        if (isHovered) return "bg-blue-50";
        return "bg-transparent";
    };

    // 图标颜色
    const getIconColor = () => {
        if (disabled) return "text-gray-400";
        if (isPressed) return "text-blue-500";
        if (isHovered) return "text-blue-400";
        return "text-blue-400";
    };

    return (
        <button
            type="button"
            title={ToolTip}
            className={clsx(
                "inline-flex items-center justify-center rounded-full transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                getBackgroundColor(),
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className
            )}
            style={{
                width: LogoScale * 16 + 10,
                height: LogoScale * 16 + 10,
                transform: isPressed ? "scale(0.92)" : "scale(1)",
                transition: "transform 80ms ease-out, background-color 150ms",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <svg
                className={clsx("transition-colors duration-150", getIconColor())}
                width={LogoScale * 16}
                height={LogoScale * 16}
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                    transform: isPressed ? "scale(0.95)" : "scale(1)",
                    transition: "transform 80ms ease-out",
                }}>
                <path d={Logo} />
            </svg>
        </button>
    );
};

export default PIconButton;
