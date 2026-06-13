import { useState, useCallback, useRef, useEffect } from "react";
import "./PSlider.css";

export interface PSliderProps {
    /** 当前值 */
    Value?: number;
    /** 最小值 */
    Min?: number;
    /** 最大值 */
    Max?: number;
    /** 步长 */
    Step?: number;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 是否显示提示 */
    ShowTooltip?: boolean;
    /** 提示格式化函数 */
    GetHintText?: (value: number) => string;
    /** 值变更事件 */
    onChange?: (value: number) => void;
    /** 自定义类名 */
    className?: string;
}

export const PSlider: React.FC<PSliderProps> = ({
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
    const trackRef = useRef<HTMLDivElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const percentage = ((value - Min) / (Max - Min)) * 100;

    const updateValue = useCallback(
        (clientX: number) => {
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
        (e: React.MouseEvent) => {
            if (disabled) return;
            setIsDragging(true);
            setShowPopup(true);
            updateValue(e.clientX);
        },
        [disabled, updateValue]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
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
                className={`pslider__thumb ${isDragging ? "pslider__thumb--dragging" : ""}`}
                style={{ left: `calc(${percentage}% - 5px)` }}
            />

            {/* 提示弹窗 */}
            {ShowTooltip && showPopup && !disabled && (
                <div
                    className="pslider__tooltip"
                    style={{ left: `${percentage}%` }}>
                    <span className="pslider__tooltip-text">{GetHintText(value)}</span>
                    <div className="pslider__tooltip-arrow" />
                </div>
            )}
        </div>
    );
};

export default PSlider;
