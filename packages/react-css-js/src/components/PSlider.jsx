import { useState, useCallback, useRef, useEffect } from "react";
import "./PSlider.css";

export const PSlider = ({
    Value: controlledValue,
    Min = 0,
    Max = 100,
    Step = 1,
    IsEnabled = true,
    ShowTooltip = true,
    GetHintText = (v) => String(v),
    onChange,
    className,
}) => {
    const disabled = !IsEnabled;
    const [internalValue, setInternalValue] = useState(Min);
    const [isDragging, setIsDragging] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const trackRef = useRef(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const percentage = ((value - Min) / (Max - Min)) * 100;

    const updateValue = useCallback(
        (clientX) => {
            if (!trackRef.current || disabled) return;

            const rect = trackRef.current.getBoundingClientRect();
            const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const newValue = Min + (newPercentage / 100) * (Max - Min);
            const steppedValue = Math.round(newValue / Step) * Step;
            const clampedValue = Math.max(Min, Math.min(Max, steppedValue));

            if (controlledValue === undefined) {
                setInternalValue(clampedValue);
            }
            onChange?.(clampedValue);
        },
        [Min, Max, Step, disabled, onChange, controlledValue]
    );

    const handleMouseDown = useCallback(
        (e) => {
            if (disabled) return;
            setIsDragging(true);
            setShowPopup(true);
            updateValue(e.clientX);
        },
        [disabled, updateValue]
    );

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                updateValue(e.clientX);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setShowPopup(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, updateValue]);

    return (
        <div
            className={`pslider ${disabled ? "pslider--disabled" : ""} ${className || ""}`}
            ref={trackRef}
            onMouseDown={handleMouseDown}>
            {/* 背景线 */}
            <div className="pslider__track-bg" />

            {/* 前景线 */}
            <div className="pslider__track-fill" style={{ width: `${percentage}%` }} />

            {/* 滑块点 */}
            <div
                className={`pslider__thumb ${isDragging ? "pslider__thumb--dragging" : ""} ${disabled ? "pslider__thumb--disabled" : ""}`}
                style={{
                    left: `calc(${percentage}% - 5px)`,
                    transform: isDragging ? "scale(1.25)" : "scale(1)",
                }}
            />

            {/* 提示弹窗 */}
            {ShowTooltip && showPopup && !disabled && (
                <div
                    className="pslider__tooltip"
                    style={{
                        left: `${percentage}%`,
                    }}>
                    <span className="pslider__tooltip-text">{GetHintText(value)}</span>
                    <div className="pslider__tooltip-arrow" />
                </div>
            )}
        </div>
    );
};

export default PSlider;
