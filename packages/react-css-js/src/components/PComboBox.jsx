import { useState, useCallback, useRef, useEffect } from "react";
import "./PComboBox.css";

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getContainerClass = () => {
        if (disabled) return "pcombobox__container--disabled";
        if (isOpen || isPressed) return "pcombobox__container--active";
        if (isHovered) return "pcombobox__container--hovered";
        return "pcombobox__container--normal";
    };

    const getTextClass = () => {
        if (disabled) return "pcombobox__text--disabled";
        return "pcombobox__text--normal";
    };

    return (
        <div ref={containerRef} className={`pcombobox ${className || ""}`}>
            {/* 输入框/触发器 */}
            <div className={`pcombobox__container ${getContainerClass()}`}>
                {IsEditable ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={displayText}
                        onChange={handleInputChange}
                        placeholder={HintText}
                        disabled={disabled}
                        className={`pcombobox__input ${getTextClass()}`}
                    />
                ) : (
                    <div
                        className={`pcombobox__display ${getTextClass()}`}
                        onClick={handleToggle}>
                        {displayText || HintText || "请选择..."}
                    </div>
                )}

                {/* 下拉箭头 */}
                <button
                    type="button"
                    disabled={disabled}
                    className={`pcombobox__arrow-btn ${disabled ? "pcombobox__arrow-btn--disabled" : "pcombobox__arrow-btn--normal"}`}
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
                            className={`pcombobox__option ${option.Value === value ? "pcombobox__option--selected" : "pcombobox__option--normal"}`}
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
