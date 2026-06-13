import { useState, useCallback, useRef } from "react";
import { clsx } from "clsx";

export interface PSearchBoxProps {
    /** 搜索值 */
    Text?: string;
    /** 占位符 */
    Hint?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 搜索按钮可见性 */
    SearchButtonVisibility?: boolean;
    /** 值变更事件 */
    onChange?: (value: string) => void;
    /** 搜索事件 */
    onSearch?: (value: string) => void;
    /** 清除事件 */
    onClear?: () => void;
    /** 自定义类名 */
    className?: string;
}

export const PSearchBox: React.FC<PSearchBoxProps> = ({
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
    const inputRef = useRef<HTMLInputElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const hasValue = value && value.length > 0;

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
        (e: React.KeyboardEvent) => {
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

    return (
        <div
            className={clsx(
                "relative flex items-center h-10 rounded-[5px] border transition-all duration-200",
                "bg-white/50 backdrop-blur-sm",
                disabled
                    ? "border-gray-300 bg-gray-50"
                    : isFocused
                      ? "border-blue-400 shadow-md"
                      : "border-blue-200 hover:border-blue-300",
                className
            )}
            style={{
                boxShadow: isFocused && !disabled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}>
            {/* 搜索图标 */}
            <svg
                className={clsx(
                    "absolute left-3.5 w-4 h-4 pointer-events-none z-10",
                    disabled ? "text-gray-400" : "text-blue-400"
                )}
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
                className={clsx(
                    "flex-1 h-full bg-transparent outline-none text-[13px]",
                    "pl-10 pr-3",
                    disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700",
                    "placeholder:text-gray-400"
                )}
            />

            {/* 清除按钮 */}
            {hasValue && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className={clsx(
                        "absolute flex items-center justify-center w-6 h-6 rounded-full",
                        "text-blue-400 hover:text-blue-500 hover:bg-blue-50",
                        "transition-all duration-150",
                        SearchButtonVisibility ? "right-17.5" : "right-2"
                    )}
                    title="清除">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
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
                    className={clsx(
                        "h-8 px-4 mr-1 rounded-[3px] text-[13px] font-medium",
                        "transition-all duration-150",
                        disabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-400 text-white hover:bg-blue-500 active:scale-95"
                    )}>
                    搜索
                </button>
            )}
        </div>
    );
};

export default PSearchBox;
