import { useState, useCallback } from "react";
import "./PCheckBox.css";

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

    const getStateClass = () => {
        if (disabled) return "pcheckbox--disabled";
        if (checked === true && isHovered) return "pcheckbox--checked-hovered";
        if (checked === true) return "pcheckbox--checked";
        if (isHovered) return "pcheckbox--hovered";
        return "";
    };

    return (
        <label className={`pcheckbox ${disabled ? "pcheckbox--disabled" : ""} ${className || ""}`}>
            <div
                className={`pcheckbox__box ${getStateClass()} ${isPressed ? "pcheckbox--pressed" : ""}`}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {/* 勾选标记 */}
                {checked === true && (
                    <svg
                        className="pcheckbox__check"
                        viewBox="0 0 12 12"
                        fill="currentColor">
                        <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
                    </svg>
                )}

                {/* 不确定状态标记 */}
                {checked === null && (
                    <div className="pcheckbox__indeterminate" />
                )}
            </div>

            {Text && <span className={`pcheckbox__text ${isHovered ? "pcheckbox__text--hovered" : ""}`}>{Text}</span>}
        </label>
    );
};

export default PCheckBox;
