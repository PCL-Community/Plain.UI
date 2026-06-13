import { useState, useCallback } from "react";
import "./PRadioButton.css";

export interface PRadioButtonProps {
    /** 是否选中 */
    Checked?: boolean;
    /** 文本 */
    Text?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 变更事件 */
    onChange?: (checked: boolean) => void;
    /** 自定义类名 */
    className?: string;
}

export const PRadioButton: React.FC<PRadioButtonProps> = ({
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

    const getStateClass = () => {
        if (disabled) return "pradiobutton--disabled";
        if (Checked) return "pradiobutton--checked";
        if (isHovered) return "pradiobutton--hovered";
        return "";
    };

    return (
        <button
            type="button"
            className={`pradiobutton ${getStateClass()} ${className || ""}`}
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-checked={Checked}
            role="radio">
            {/* 图标 */}
            {Logo && (
                <svg className="pradiobutton__icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {/* 文本 */}
            {Text && <span className="pradiobutton__text">{Text}</span>}
        </button>
    );
};

export default PRadioButton;
