import { useState, useCallback } from "react";
import "./PIconButton.css";

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

    const getStateClass = () => {
        if (disabled) return "piconbutton--disabled";
        if (isPressed) return "piconbutton--pressed";
        if (isHovered) return "piconbutton--hovered";
        return "";
    };

    const size = LogoScale * 16 + 10;

    return (
        <button
            type="button"
            title={ToolTip}
            className={`piconbutton ${getStateClass()} ${className || ""}`}
            style={{
                width: size,
                height: size,
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <svg
                className="piconbutton__icon"
                width={LogoScale * 16}
                height={LogoScale * 16}
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d={Logo} />
            </svg>
        </button>
    );
};

export default PIconButton;
