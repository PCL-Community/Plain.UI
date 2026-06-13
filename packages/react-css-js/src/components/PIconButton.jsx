import { useState, useCallback } from "react";
import "./PIconButton.css";

export const PIconButton = ({
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
        (event) => {
            if (!disabled) onClick?.(event);
        },
        [disabled, onClick]
    );

    const getButtonClass = () => {
        if (disabled) return "piconbutton--disabled";
        if (isPressed) return "piconbutton--pressed";
        if (isHovered) return "piconbutton--hovered";
        return "piconbutton--normal";
    };

    const getIconClass = () => {
        if (disabled) return "piconbutton__icon--disabled";
        if (isPressed) return "piconbutton__icon--pressed";
        if (isHovered) return "piconbutton__icon--hovered";
        return "piconbutton__icon--normal";
    };

    return (
        <button
            type="button"
            title={ToolTip}
            className={`piconbutton ${getButtonClass()} ${className || ""}`}
            style={{
                width: LogoScale * 16 + 10,
                height: LogoScale * 16 + 10,
                transform: isPressed ? "scale(0.92)" : "scale(1)",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <svg
                className={`piconbutton__icon ${getIconClass()}`}
                width={LogoScale * 16}
                height={LogoScale * 16}
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                    transform: isPressed ? "scale(0.95)" : "scale(1)",
                }}>
                <path d={Logo} />
            </svg>
        </button>
    );
};

export default PIconButton;
