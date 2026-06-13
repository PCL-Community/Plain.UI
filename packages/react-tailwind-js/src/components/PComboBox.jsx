import { useState, useCallback, useRef, useEffect } from "react";
import { clsx } from "clsx";

export const PComboBox = ({
    Items,
    Text: controlledValue,
    HintText = "",
    IsEditable = false,
    IsEnabled = true,
    onChange,
    onTextChange,
    className,
}) => {
    const disabled = !IsEnabled;
    const [internalValue, setInternalValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [_isFocused, setIsFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const selectedOption = Items.find((opt) => opt.Value === value);
    const displayText = selectedOption?.Label || (IsEditable ? value : "");

    const handleSelect = useCallback(
        (option) => {
            if (controlledValue === undefined) {
                setInternalValue(option.Value);
            }
            onChange?.(option.Value);
            setIsOpen(false);
        },
        [onChange, controlledValue]
    );

    const handleInputChange = useCallback(
        (e) => {
            const newText = e.target.value;
            if (controlledValue === undefined) {
                setInternalValue(newText);
            }
            onTextChange?.(newText);
            onChange?.(newText);
        },
        [onTextChange, onChange, controlledValue]
    );

    const handleToggle = useCallback(() => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    }, [isOpen, disabled]);

    // 点击外部关闭下拉
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 颜色状态
    const getBorderColor = () => {
        if (disabled) return "border-gray-400";
        if (isOpen || isPressed) return "border-blue-500";
        if (isHovered) return "border-blue-400";
        return "border-blue-300";
    };

    const getBackgroundColor = () => {
        if (disabled) return "bg-gray-100";
        if (isOpen || isPressed) return "bg-blue-50";
        if (isHovered) return "bg-blue-50";
        return "bg-white/50";
    };

    const getTextColor = () => {
        if (disabled) return "text-gray-400";
        return "text-gray-700";
    };

    return (
        <div ref={containerRef} className={clsx("relative", className)}>
            {/* 输入框/触发器 */}
            <div
                className={clsx(
                    "flex items-center border rounded-[3px] transition-all duration-200",
                    getBorderColor(),
                    getBackgroundColor()
                )}>
                {IsEditable ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={displayText}
                        onChange={handleInputChange}
                        placeholder={HintText}
                        disabled={disabled}
                        className={clsx(
                            "flex-1 px-3 py-2 text-[13px] bg-transparent outline-none",
                            getTextColor(),
                            "placeholder:text-gray-400"
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                ) : (
                    <div
                        className={clsx("flex-1 px-3 py-2 text-[13px] cursor-pointer select-none", getTextColor())}
                        onClick={handleToggle}>
                        {displayText || HintText || "请选择..."}
                    </div>
                )}

                {/* 下拉箭头 */}
                <button
                    type="button"
                    disabled={disabled}
                    className={clsx(
                        "px-3 py-2 transition-colors duration-200",
                        disabled ? "text-gray-400 cursor-not-allowed" : "text-blue-400 hover:text-blue-500"
                    )}
                    onClick={handleToggle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}>
                    <svg
                        className={clsx("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
            </div>

            {/* 下拉选项列表 */}
            {isOpen && (
                <div
                    className={clsx(
                        "absolute z-50 w-full mt-1 py-1",
                        "bg-white border border-blue-300 rounded-[3px] shadow-lg",
                        "max-h-60 overflow-auto"
                    )}>
                    {Items.map((option) => (
                        <div
                            key={option.Value}
                            className={clsx(
                                "px-3 py-2 text-[13px] cursor-pointer transition-colors duration-150",
                                option.Value === value
                                    ? "bg-blue-100 text-blue-500"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-400"
                            )}
                            onClick={() => handleSelect(option)}>
                            {option.Label}
                        </div>
                    ))}
                    {Items.length === 0 && <div className="px-3 py-2 text-[13px] text-gray-400">无选项</div>}
                </div>
            )}
        </div>
    );
};

export default PComboBox;
