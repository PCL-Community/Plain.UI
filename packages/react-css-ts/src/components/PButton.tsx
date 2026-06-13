import { useState, useCallback } from "react";
import "./PButton.css";

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

    const getColorClass = () => {
        if (disabled) return "pbutton--disabled";
        switch (ColorState) {
            case "Highlight":
                return "pbutton--highlight";
            case "Red":
                return "pbutton--red";
            default:
                return "pbutton--normal";
        }
    };

    const getStateClass = () => {
        if (isPressed) return "pbutton--pressed";
        if (isHovered) return "pbutton--hovered";
        return "";
    };

    return (
        <button
            className={`pbutton ${getColorClass()} ${getStateClass()} ${className || ""}`}
            style={{ padding: Padding }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <span className="pbutton__text">
                {children || Text}
            </span>
        </button>
    );
};

export default PButton;
