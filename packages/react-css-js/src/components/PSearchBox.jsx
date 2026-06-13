import { useState, useCallback, useRef } from "react";
import "./PSearchBox.css";

export const PSearchBox = ({
    Text: controlledValue,
    Hint = "搜索...",
    IsEnabled = true,
    SearchButtonVisibility = false,
    onChange,
    onSearch,
    onClear,
    className,
}) => {
    const disabled = !IsEnabled;
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const hasValue = value && value.length > 0;

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

    const handleClear = useCallback(() => {
        if (controlledValue === undefined) {
            setInternalValue("");
        }
        onChange?.("");
        onClear?.();
        inputRef.current?.focus();
    }, [onChange, onClear, controlledValue]);

    const handleSearch = useCallback(() => {
        onSearch?.(value);
    }, [onSearch, value]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const getContainerClass = () => {
        if (disabled) return "psearchbox--disabled";
        if (isFocused) return "psearchbox--focused";
        return "psearchbox--normal";
    };

    return (
        <div
            className={`psearchbox ${getContainerClass()} ${className || ""}`}
            style={{
                boxShadow: isFocused && !disabled
                    ? "0 4px 20px rgba(0, 0, 0, 0.1)"
                    : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}>
            {/* 搜索图标 */}
            <svg
                className={`psearchbox__search-icon ${disabled ? "psearchbox__search-icon--disabled" : ""}`}
                viewBox="0 0 1024 1024"
                fill="currentColor">
                <path d="M675.9168 242.816C556.3008 123.2 362.4448 123.2 242.8288 242.816 123.2128 362.432 123.2128 556.288 242.8288 675.904 362.4448 795.52 556.3008 795.52 675.9168 675.904 795.5328 556.288 795.5328 362.432 675.9168 242.816L675.9168 242.816ZM1000.7168 892.48C1030.6048 922.368 1030.6048 970.816 1000.7168 1000.704 970.8288 1030.656 922.3808 1030.656 892.4288 1000.704L730.0608 838.336C728.1408 836.416 727.4368 833.92 725.7728 831.872 546.3168 960.448 295.7568 945.408 134.5408 784.192-44.8512 604.8-44.8512 313.92 134.5408 134.528 313.9328-44.864 604.8128-44.864 784.2048 134.528 945.4208 295.744 960.4608 546.304 831.8848 725.76 833.9328 727.424 836.4288 728.128 838.3488 730.048L1000.7168 892.48Z" />
            </svg>

            {/* 输入框 */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={Hint}
                disabled={disabled}
                className={`psearchbox__input ${disabled ? "psearchbox__input--disabled" : "psearchbox__input--normal"}`}
            />

            {/* 清除按钮 */}
            {hasValue && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className={`psearchbox__clear ${SearchButtonVisibility ? "psearchbox__clear--with-button" : ""}`}
                    title="清除">
                    <svg className="psearchbox__clear-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            )}

            {/* 搜索按钮 */}
            {SearchButtonVisibility && (
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={disabled}
                    className="psearchbox__button">
                    搜索
                </button>
            )}
        </div>
    );
};

export default PSearchBox;
