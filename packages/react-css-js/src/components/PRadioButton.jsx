import { useState, useCallback } from "react";
import "./PRadioButton.css";

export const PRadioButton = ({
    Checked = false,
    Text,
    Logo,
    IsEnabled = true,
    onChange,
    className,
}) => {
    const disabled = !IsEnabled;
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        if (!disabled && !Checked) {
            onChange?.(true);
        }
    }, [disabled, Checked, onChange]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const getButtonClass = () => {
        if (disabled) return "pradiobutton--disabled";
        if (Checked) return "pradiobutton--checked";
        if (isHovered) return "pradiobutton--hovered";
        return "pradiobutton--normal";
    };

    const getTextClass = () => {
        if (disabled) return "pradiobutton__text--disabled";
        if (Checked) return "pradiobutton__text--checked";
        if (isHovered) return "pradiobutton__text--hovered";
        return "pradiobutton__text--normal";
    };

    const getIconClass = () => {
        if (disabled) return "pradiobutton__icon--disabled";
        if (Checked) return "pradiobutton__icon--checked";
        return "pradiobutton__icon--normal";
    };

    return (
        <button
            type="button"
            className={`pradiobutton ${getButtonClass()} ${className || ""}`}
            style={{
                minHeight: "27px",
                maxHeight: "27px",
                padding: "0 12px",
            }}
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-checked={Checked}
            role="radio">
            {Logo && (
                <svg className={`pradiobutton__icon ${getIconClass()}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {Text && <span className={`pradiobutton__text ${getTextClass()}`}>{Text}</span>}
        </button>
    );
};

export default PRadioButton;
