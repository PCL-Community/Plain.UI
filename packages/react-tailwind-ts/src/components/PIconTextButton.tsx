import { useState, useCallback } from "react";
import { clsx } from "clsx";

export interface PIconTextButtonProps {
    /** 文本 */
    Text: string;
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
}

export const PIconTextButton: React.FC<PIconTextButtonProps> = ({
    Text,
    Logo,
    LogoScale = 1,
    IsEnabled = true,
    onClick,
    className,
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
        [disabled, onClick]
    );

    return (
        <button
            type="button"
            className={clsx(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-[13.5px]",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90",
                className
            )}
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                minHeight: "27px",
                maxHeight: "27px",
                transform: isPressed ? "scale(0.96)" : "scale(1)",
                transition: "transform 80ms ease-out, opacity 150ms",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 图标 */}
            <svg
                className="text-white shrink-0"
                width={LogoScale * 16}
                height={LogoScale * 16}
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                    transform: isPressed ? "scale(0.92)" : "scale(1)",
                    transition: "transform 80ms ease-out",
                }}>
                <path d={Logo} />
            </svg>

            {/* 文本 */}
            <span className="text-[13px] text-white whitespace-nowrap">{Text}</span>
        </button>
    );
};

export default PIconTextButton;
