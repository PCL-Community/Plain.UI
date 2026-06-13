import { useState, useCallback } from "react";
import "./PExtraTextButton.css";

export const PExtraTextButton = ({
    Text,
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

    return (
        <button
            type="button"
            title={ToolTip || Text}
            className={`pextratextbutton ${disabled ? "pextratextbutton--disabled" : ""} ${className || ""}`}
            style={{
                transform: isPressed ? "scale(0.96)" : "scale(1)",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 背景层 */}
            <div className={`pextratextbutton__bg ${isPressed ? "pextratextbutton__bg--pressed" : ""}`} />

            {/* 图标 */}
            {Logo && (
                <svg
                    className={`pextratextbutton__icon ${disabled ? "pextratextbutton__icon--disabled" : ""}`}
                    width={LogoScale * 16}
                    height={LogoScale * 16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                        transform: isPressed ? "scale(0.9)" : "scale(1)",
                    }}>
                    <path d={Logo} />
                </svg>
            )}

            {/* 文本 */}
            <span className={`pextratextbutton__text ${disabled ? "pextratextbutton__text--disabled" : ""}`}>
                {Text}
            </span>
        </button>
    );
};

export default PExtraTextButton;
