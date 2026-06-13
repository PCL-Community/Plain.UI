import { useState, useCallback, useRef, useEffect } from "react";
import "./PComboBox.css";

export interface PComboBoxItem {
    Value: string;
    Label: string;
}

export interface PComboBoxProps {
    /** 选项列表 */
    Items: PComboBoxItem[];
    /** 当前选中值 */
    Text?: string;
    /** 提示文本 */
    HintText?: string;
    /** 是否可编辑 */
    IsEditable?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 值变更事件 */
    onChange?: (value: string) => void;
    /** 文本变更事件 */
    onTextChange?: (text: string) => void;
    /** 自定义类名 */
    className?: string;
}

export const PComboBox: React.FC<PComboBoxProps> = ({
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
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const selectedOption = Items.find((opt) => opt.Value === value);
    const displayText = selectedOption?.Label || (IsEditable ? value : "");

    const handleSelect = useCallback(
        (option: PComboBoxItem) => {
            if (controlledValue === undefined) {
                setInternalValue(option.Value);
            }
            onChange?.(option.Value);
            setIsOpen(false);
        },
        [onChange, controlledValue]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStateClass = () => {
        if (disabled) return "pcombobox--disabled";
        if (isOpen || isPressed) return "pcombobox--active";
        if (isHovered) return "pcombobox--hovered";
        return "";
    };

    return (
        <div ref={containerRef} className={`pcombobox ${className || ""}`}>
            {/* 输入框/触发器 */}
            <div className={`pcombobox__trigger ${getStateClass()}`}>
                {IsEditable ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={displayText}
                        onChange={handleInputChange}
                        placeholder={HintText}
                        disabled={disabled}
                        className="pcombobox__input"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                ) : (
                    <div
                        className="pcombobox__display"
                        onClick={handleToggle}>
                        {displayText || HintText || "请选择..."}
                    </div>
                )}

                {/* 下拉箭头 */}
                <button
                    type="button"
                    disabled={disabled}
                    className={`pcombobox__arrow-btn ${disabled ? "pcombobox__arrow-btn--disabled" : ""}`}
                    onClick={handleToggle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}>
                    <svg
                        className={`pcombobox__arrow ${isOpen ? "pcombobox__arrow--open" : ""}`}
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
            </div>

            {/* 下拉选项列表 */}
            {isOpen && (
                <div className="pcombobox__dropdown">
                    {Items.map((option) => (
                        <div
                            key={option.Value}
                            className={`pcombobox__option ${option.Value === value ? "pcombobox__option--selected" : ""}`}
                            onClick={() => handleSelect(option)}>
                            {option.Label}
                        </div>
                    ))}
                    {Items.length === 0 && <div className="pcombobox__empty">无选项</div>}
                </div>
            )}
        </div>
    );
};

export default PComboBox;
