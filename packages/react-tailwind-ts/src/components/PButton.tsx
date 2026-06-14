import { useState, useCallback } from "react";
import { clsx } from "clsx";
import "../styles/theme.css";

export type PButtonColorState = "Normal" | "Highlight" | "Red";

export interface PButtonProps {
    /** 按钮文本 */
    Text?: string;
    /** 颜色状态 */
    ColorState?: PButtonColorState;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 内边距 */
    Padding?: string;
    /** 点击事件 */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** 自定义类名 */
    className?: string;
    /** 子元素 */
    children?: React.ReactNode;
}

export const PButton: React.FC<PButtonProps> = ({
    Text,
    ColorState = "Normal",
    IsEnabled = true,
    Padding = "6px 12px",
    onClick,
    className,
    children,
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

    // 根据 ColorState 和状态确定边框颜色
    const getBorderColor = () => {
        if (disabled) return "border-gray-400";

        switch (ColorState) {
            case "Normal":
                return isHovered ? "border-blue-500" : "border-blue-400";
            case "Highlight":
                return isHovered ? "border-blue-500" : "border-blue-300";
            case "Red":
                return isHovered ? "border-red-400" : "border-red-500";
            default:
                return "border-blue-400";
        }
    };

    // 根据 ColorState 和状态确定背景色
    const getBackgroundColor = () => {
        if (disabled) return "bg-gray-100";

        if (isPressed) {
            switch (ColorState) {
                case "Red":
                    return "bg-red-50";
                default:
                    return "bg-blue-50";
            }
        }

        if (isHovered) {
            switch (ColorState) {
                case "Red":
                    return "bg-red-50";
                default:
                    return "bg-blue-50";
            }
        }

        return "bg-white/50";
    };

    // 文本颜色
    const getTextColor = () => {
        if (disabled) return "text-gray-400";

        switch (ColorState) {
            case "Normal":
                return isHovered ? "text-blue-500" : "text-blue-400";
            case "Highlight":
                return isHovered ? "text-blue-500" : "text-blue-300";
            case "Red":
                return isHovered ? "text-red-400" : "text-red-500";
            default:
                return "text-blue-400";
        }
    };

    return (
        <button
            className={clsx(
                "relative inline-flex items-center justify-center rounded-[3px]",
                "border transition-all duration-200 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                getBorderColor(),
                getBackgroundColor(),
                className
            )}
            style={{
                padding: Padding,
                transform: isPressed ? "scale(0.955)" : "scale(1)",
                transition: "transform 80ms ease-out, background-color 200ms, border-color 200ms",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <span
                className={clsx("text-[13px] font-medium whitespace-nowrap", "transition-colors duration-200", getTextColor())}
                style={{
                    transform: isPressed ? "scale(0.99)" : "scale(1)",
                    transition: "transform 80ms ease-out",
                }}>
                {children || Text}
            </span>
        </button>
    );
};

export default PButton;
