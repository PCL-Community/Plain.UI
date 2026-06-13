import { useState, useCallback } from "react";
import "./PListItem.css";

export const PListItem = ({
    Title,
    Info,
    Logo,
    Checked = false,
    IsEnabled = true,
    onClick,
    className,
}) => {
    const disabled = !IsEnabled;
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = useCallback(() => {
        if (!disabled) onClick?.();
    }, [disabled, onClick]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setIsPressed(false);
    }, []);

    const handleMouseDown = useCallback(() => {
        if (!disabled) setIsPressed(true);
    }, [disabled]);

    const handleMouseUp = useCallback(() => {
        setIsPressed(false);
    }, []);

    const getItemClass = () => {
        if (disabled) return "plistitem--disabled";
        if (isHovered) return "plistitem--hovered";
        return "plistitem--normal";
    };

    const getIndicatorClass = () => {
        return Checked ? "plistitem__indicator--checked" : "plistitem__indicator--normal";
    };

    const getIconClass = () => {
        if (Checked) return "plistitem__icon--checked";
        if (isHovered && !disabled && !Checked) return "plistitem__icon--hovered";
        return "plistitem__icon--normal";
    };

    const getTitleClass = () => {
        if (Checked) return "plistitem__title--checked";
        if (isHovered && !disabled && !Checked) return "plistitem__title--hovered";
        return "plistitem__title--normal";
    };

    return (
        <div
            className={`plistitem ${getItemClass()} ${className || ""}`}
            style={{
                transform: isPressed ? "scale(0.995)" : "scale(1)",
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            {/* 左侧指示条 */}
            <div className={`plistitem__indicator ${getIndicatorClass()}`} />

            {/* 图标 */}
            {Logo && (
                <svg className={`plistitem__icon ${getIconClass()}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {/* 内容区域 */}
            <div className="plistitem__content">
                <div className={`plistitem__title ${getTitleClass()}`}>{Title}</div>
                {Info && <div className="plistitem__info">{Info}</div>}
            </div>
        </div>
    );
};

export default PListItem;
