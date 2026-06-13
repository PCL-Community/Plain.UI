import { useState, useCallback } from "react";
import "./PListItem.css";

export interface PListItemProps {
    /** 标题 */
    Title: string;
    /** 信息/副标题 */
    Info?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否选中 */
    Checked?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: () => void;
    /** 自定义类名 */
    className?: string;
}

export const PListItem: React.FC<PListItemProps> = ({
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

    return (
        <div
            className={`plistitem ${disabled ? "plistitem--disabled" : ""} ${isHovered && !disabled ? "plistitem--hovered" : ""} ${className || ""}`}
            style={{
                transform: isPressed ? "scale(0.995)" : "scale(1)",
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            {/* 左侧指示条 */}
            <div className={`plistitem__indicator ${Checked ? "plistitem__indicator--checked" : ""}`} />

            {/* 图标 */}
            {Logo && (
                <svg
                    className={`plistitem__icon ${Checked ? "plistitem__icon--checked" : ""} ${isHovered && !disabled && !Checked ? "plistitem__icon--hovered" : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {/* 内容区域 */}
            <div className="plistitem__content">
                <div className={`plistitem__title ${Checked ? "plistitem__title--checked" : ""} ${isHovered && !disabled && !Checked ? "plistitem__title--hovered" : ""}`}>
                    {Title}
                </div>
                {Info && <div className="plistitem__info">{Info}</div>}
            </div>
        </div>
    );
};

export default PListItem;
