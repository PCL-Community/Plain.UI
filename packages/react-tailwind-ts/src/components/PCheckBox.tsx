import { useState, useCallback } from "react";
import { clsx } from "clsx";

export interface PCheckBoxProps {
    /** 是否选中 */
    Checked?: boolean | null;
    /** 是否为三态复选框 */
    IsThreeState?: boolean;
    /** 文本 */
    Text?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 变更事件 */
    onChange?: (checked: boolean | null, user: boolean) => void;
    /** 预览变更事件（可取消） */
    onPreviewChange?: (checked: boolean | null) => boolean;
    /** 自定义类名 */
    className?: string;
}

export const PCheckBox: React.FC<PCheckBoxProps> = ({
    Checked: controlledChecked,
    IsThreeState = false,
    Text,
    IsEnabled = true,
    onChange,
    onPreviewChange,
    className,
}) => {
    const disabled = !IsEnabled;
    const [internalChecked, setInternalChecked] = useState<boolean | null>(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const getNextState = useCallback(
        (current: boolean | null): boolean | null => {
            if (IsThreeState) {
                switch (current) {
                    case true:
                        return null;
                    case false:
                        return true;
                    case null:
                        return false;
                }
            }
            return !current;
        },
        [IsThreeState]
    );

    const handleClick = useCallback(() => {
        if (disabled) return;

        const nextState = getNextState(checked);

        // 预览事件，可取消
        if (onPreviewChange) {
            const allowed = onPreviewChange(nextState);
            if (!allowed) return;
        }

        if (controlledChecked === undefined) {
            setInternalChecked(nextState);
        }
        onChange?.(nextState, true);
    }, [checked, disabled, getNextState, onChange, onPreviewChange, controlledChecked]);

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

    // 边框颜色
    const getBorderColor = () => {
        if (disabled) return "border-gray-400";
        if (checked === true) return isHovered ? "border-blue-500" : "border-blue-400";
        return isHovered ? "border-blue-500" : "border-blue-400";
    };

    // 背景颜色
    const getBackgroundColor = () => {
        if (disabled) return "bg-gray-100";
        if (isPressed && checked === true) return "bg-blue-100";
        return "bg-white/50";
    };

    // 文本颜色
    const getTextColor = () => {
        if (disabled) return "text-gray-400";
        if (isHovered) return "text-blue-500";
        return "text-blue-400";
    };

    return (
        <label
            className={clsx(
                "inline-flex items-center gap-2 cursor-pointer select-none",
                disabled && "cursor-not-allowed",
                className
            )}>
            <div
                className={clsx(
                    "relative size-4.5 rounded-[3px] border transition-all duration-150",
                    "flex items-center justify-center",
                    getBorderColor(),
                    getBackgroundColor()
                )}
                style={{
                    transform: isPressed ? "scale(0.92)" : "scale(1)",
                    transition: "transform 100ms ease-out, background-color 150ms, border-color 150ms",
                }}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {/* 勾选标记 */}
                {checked === true && (
                    <svg
                        className={clsx("w-3 h-3 transition-all duration-150", disabled ? "text-gray-400" : "text-blue-400")}
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        style={{
                            transform: isPressed ? "scale(0.9)" : "scale(1)",
                            transition: "transform 100ms ease-out",
                        }}>
                        <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
                    </svg>
                )}

                {/* 不确定状态标记 */}
                {checked === null && (
                    <div
                        className={clsx("w-2.5 h-2.5 rounded-xs", disabled ? "bg-gray-400" : "bg-blue-400")}
                        style={{
                            transform: isPressed ? "scale(0.9)" : "scale(1)",
                            transition: "transform 100ms ease-out",
                        }}
                    />
                )}
            </div>

            {Text && <span className={clsx("text-[13px] transition-colors duration-150", getTextColor())}>{Text}</span>}
        </label>
    );
};

export default PCheckBox;
