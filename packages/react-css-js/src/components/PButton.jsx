import { useState, useCallback } from "react";
import "./PButton.css";
import "../styles/theme.css";

export const PButton = ({
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
        (event) => {
            if (!disabled) onClick?.(event);
        },
        [disabled, onClick]
    );

    const getStateClass = () => {
        if (disabled) return "pbutton--disabled";
        if (isPressed) return `pbutton--pressed pbutton--${ColorState.toLowerCase()}--pressed`;
        if (isHovered) return `pbutton--hovered pbutton--${ColorState.toLowerCase()}--hovered`;
        return `pbutton--${ColorState.toLowerCase()}`;
    };

    const getTextClass = () => {
        if (disabled) return "pbutton__text--disabled";
        if (isHovered) return `pbutton__text--${ColorState.toLowerCase()}--hovered`;
        return `pbutton__text--${ColorState.toLowerCase()}`;
    };

    return (
        <button
            className={`pbutton ${getStateClass()} ${className || ""}`}
            style={{
                padding: Padding,
                transform: isPressed ? "scale(0.955)" : "scale(1)",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <span
                className={`pbutton__text ${getTextClass()}`}
                style={{
                    transform: isPressed ? "scale(0.99)" : "scale(1)",
                }}>
                {children || Text}
            </span>
        </button>
    );
};

export default PButton;
