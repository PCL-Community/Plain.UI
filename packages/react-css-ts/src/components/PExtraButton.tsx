import { useState, useCallback } from "react";
import "./PExtraButton.css";

export interface PExtraButtonProps {
    /** 图标 (SVG path) */
    Logo: string;
    /** 图标大小 */
    LogoScale?: number;
    /** 进度值 (0-100) */
    Progress?: number;
    /** 是否显示进度 */
    ShowProgress?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** 右键点击事件 */
    onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** 自定义类名 */
    className?: string;
    /** 标题/提示 */
    ToolTip?: string;
}

export const PExtraButton: React.FC<PExtraButtonProps> = ({
    Logo,
    LogoScale = 1,
    Progress = 0,
    ShowProgress = false,
    IsEnabled = true,
    onClick,
    onContextMenu,
    className,
    ToolTip,
}) => {
    const disabled = !IsEnabled;
    const [isPressed, setIsPressed] = useState(false);
    const [_isHovered, setIsHovered] = useState(false);
    const [isVisible, _setIsVisible] = useState(true);

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

    const handleContextMenu = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (!disabled) onContextMenu?.(event);
        },
        [disabled, onContextMenu]
    );

    // 计算进度高度
    const progressHeight = ShowProgress ? Math.max(0, Math.min(100, Progress)) : 0;

    return (
        <button
            type="button"
            title={ToolTip}
            className={`pextrabutton ${disabled ? "pextrabutton--disabled" : ""} ${className || ""}`}
            style={{
                transform: isPressed ? "scale(0.92)" : isVisible ? "scale(1)" : "scale(0)",
            }}
            disabled={disabled}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* 背景层 */}
            <div className={`pextrabutton__bg ${isPressed ? "pextrabutton__bg--pressed" : ""}`} />

            {/* 进度层 */}
            {ShowProgress && (
                <div
                    className="pextrabutton__progress"
                    style={{ height: `${progressHeight}%` }}
                />
            )}

            {/* 图标 */}
            <div className="pextrabutton__icon-wrapper">
                <svg
                    className={`pextrabutton__icon ${disabled ? "pextrabutton__icon--disabled" : ""}`}
                    width={LogoScale * 16}
                    height={LogoScale * 16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                        transform: isPressed ? "scale(0.9)" : "scale(1)",
                    }}>
                    <path d={Logo} />
                </svg>
            </div>
        </button>
    );
};

export default PExtraButton;
