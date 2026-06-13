import { useState, useCallback, useRef } from "react";
import "./PTextBox.css";

export interface PTextBoxProps {
    /** 输入值 */
    Text?: string;
    /** 提示文本 */
    HintText?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 圆角 */
    CornerRadius?: number;
    /** 是否有背景 */
    HasBackground?: boolean;
    /** 是否显示验证结果 */
    ShowValidateResult?: boolean;
    /** 验证错误信息 */
    ValidateResult?: string;
    /** 输入变更事件 */
    onChange?: (value: string) => void;
    /** 回车事件 */
    onPressEnter?: () => void;
    /** 失去焦点事件 */
    onBlur?: () => void;
    /** 自定义类名 */
    className?: string;
    /** 占位符 */
    Placeholder?: string;
    /** 输入类型 */
    Type?: "text" | "password" | "number";
}

export const PTextBox: React.FC<PTextBoxProps> = ({
    Text: controlledValue,
    HintText,
    IsEnabled = false,
    CornerRadius = 3,
    HasBackground = true,
    ShowValidateResult = true,
    ValidateResult,
    onChange,
    onPressEnter,
    onBlur,
    className,
    Placeholder,
    Type = "text",
}) => {
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const isValidated = !ValidateResult || ValidateResult === "";
    const hasError = !isValidated && ShowValidateResult && value !== "";

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onChange?.(newValue);
        },
        [onChange, controlledValue]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                onPressEnter?.();
            }
        },
        [onPressEnter]
    );

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const getStateClass = () => {
        if (IsEnabled) return "ptextbox--enabled";
        if (hasError) return "ptextbox--error";
        if (isFocused) return "ptextbox--focused";
        if (isHovered) return "ptextbox--hovered";
        return "";
    };

    return (
        <div className={`ptextbox ${className || ""}`}>
            <div
                className={`ptextbox__container ${getStateClass()} ${!HasBackground ? "ptextbox--no-bg" : ""}`}
                style={{ borderRadius: `${CornerRadius}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <input
                    ref={inputRef}
                    type={Type}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={!IsEnabled}
                    placeholder={Placeholder}
                    className="ptextbox__input"
                />

                {/* 提示文本 */}
                {HintText && !value && !Placeholder && (
                    <span className="ptextbox__hint">{HintText}</span>
                )}
            </div>

            {/* 验证错误信息 */}
            {hasError && ShowValidateResult && (
                <div className="ptextbox__error">{ValidateResult}</div>
            )}
        </div>
    );
};

export default PTextBox;
