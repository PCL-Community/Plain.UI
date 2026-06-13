import { useState, useCallback } from "react";
import { clsx } from "clsx";

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

    // 背景颜色 - 选中时为蓝色，未选中时透明
    const getBackgroundColor = () => {
        if (disabled) return "bg-gray-200";
        if (Checked) return "bg-blue-400";
        if (isHovered) return "bg-blue-100";
        return "bg-transparent";
    };

    // 文本颜色
    const getTextColor = () => {
        if (disabled) return "text-gray-400";
        if (Checked) return "text-white";
        if (isHovered) return "text-blue-500";
        return "text-blue-400";
    };

    // 图标颜色
    const getIconColor = () => {
        if (disabled) return "text-gray-400";
        if (Checked) return "text-white";
        return "text-blue-400";
    };

    return (
        <button
            type="button"
            className={clsx(
                "inline-flex items-center rounded-full transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                getBackgroundColor(),
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className
            )}
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
            {/* 图标 */}
            {Logo && (
                <svg className={clsx("w-4 h-4 mr-2 shrink-0", getIconColor())} viewBox="0 0 24 24" fill="currentColor">
                    <path d={Logo} />
                </svg>
            )}

            {/* 文本 */}
            {Text && <span className={clsx("text-[13px] whitespace-nowrap", getTextColor())}>{Text}</span>}
        </button>
    );
};

export default PRadioButton;
