import { useState, useCallback, useRef } from "react";
import "./PTextBox.css";

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

    const getContainerClass = () => {
        if (IsEnabled) return "ptextbox__container--disabled";
        if (hasError) return "ptextbox__container--error";
        if (isFocused) return "ptextbox__container--focused";
        if (isHovered) return "ptextbox__container--hovered";
        return "ptextbox__container--normal";
    };

    const getBackgroundClass = () => {
        if (!HasBackground) return "ptextbox__container--transparent";
        if (IsEnabled) return "ptextbox__container--bg-disabled";
        if (hasError) return "ptextbox__container--bg-error";
        if (isFocused) return "ptextbox__container--bg-focused";
        if (isHovered) return "ptextbox__container--bg-hovered";
        return "ptextbox__container--bg-normal";
    };

    const getTextClass = () => {
        if (!IsEnabled) return "ptextbox__input--disabled";
        if (hasError) return "ptextbox__input--error";
        return "ptextbox__input--normal";
    };

    return (
        <div className={`ptextbox ${className || ""}`}>
            <div
                className={`ptextbox__container ${getContainerClass()} ${getBackgroundClass()}`}
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
                    className={`ptextbox__input ${getTextClass()}`}
                />

                {HintText && !value && !Placeholder && (
                    <span className="ptextbox__hint">{HintText}</span>
                )}
            </div>

            {hasError && ShowValidateResult && (
                <div className="ptextbox__error">{ValidateResult}</div>
            )}
        </div>
    );
};

export default PTextBox;
