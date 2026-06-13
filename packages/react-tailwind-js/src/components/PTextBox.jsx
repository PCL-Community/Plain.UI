import { useState, useCallback, useRef } from "react";
import { clsx } from "clsx";

export const PTextBox = ({
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
    const inputRef = useRef(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const isValidated = !ValidateResult || ValidateResult === "";
    const hasError = !isValidated && ShowValidateResult && value !== "";

    const handleChange = useCallback(
        (e) => {
            const newValue = e.target.value;
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onChange?.(newValue);
        },
        [onChange, controlledValue]
    );

    const handleKeyDown = useCallback(
        (e) => {
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

    // 边框颜色
    const getBorderColor = () => {
        if (IsEnabled) return "border-gray-400";
        if (hasError) return "border-red-400";
        if (isFocused) return "border-blue-500";
        if (isHovered) return "border-blue-400";
        return "border-blue-300";
    };

    // 背景颜色
    const getBackgroundColor = () => {
        if (!HasBackground) return "bg-transparent";
        if (IsEnabled) return "bg-gray-100";
        if (hasError) return "bg-red-50";
        if (isFocused) return "bg-blue-50";
        if (isHovered) return "bg-blue-50";
        return "bg-white/50";
    };

    // 文本颜色
    const getTextColor = () => {
        if (!IsEnabled) return "text-gray-400";
        if (hasError) return "text-red-500";
        return "text-gray-700";
    };

    return (
        <div className={clsx("flex flex-col gap-1", className)}>
            <div
                className={clsx(
                    "relative flex items-center border transition-all duration-200",
                    getBorderColor(),
                    getBackgroundColor()
                )}
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
                    className={clsx(
                        "w-full px-3 py-2 text-[13px] bg-transparent outline-none",
                        getTextColor(),
                        "placeholder:text-gray-400"
                    )}
                />

                {/* 提示文本 */}
                {HintText && !value && !Placeholder && (
                    <span className="absolute left-3 text-[13px] text-gray-400 pointer-events-none">{HintText}</span>
                )}
            </div>

            {/* 验证错误信息 */}
            {hasError && ShowValidateResult && <div className="text-[12px] text-red-500 animate-fadeIn">{ValidateResult}</div>}
        </div>
    );
};

export default PTextBox;
