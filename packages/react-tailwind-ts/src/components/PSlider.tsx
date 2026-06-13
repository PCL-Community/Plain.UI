import { useState, useCallback, useRef, useEffect } from "react";
import { clsx } from "clsx";

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
            className={clsx(
                "relative w-full h-4 flex items-center",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className
            )}
            ref={trackRef}
            onMouseDown={handleMouseDown}>
            {/* 背景线 */}
            <div className="absolute w-full h-1 bg-blue-200/30 rounded-full" />

            {/* 前景线 */}
            <div className="absolute h-1 bg-blue-400 rounded-full" style={{ width: `${percentage}%` }} />

            {/* 滑块点 */}
            <div
                className={clsx(
                    "absolute w-2.5 h-2.5 rounded-full border transition-transform duration-150",
                    "bg-blue-100 border-blue-400",
                    isDragging && "scale-125",
                    disabled && "bg-gray-100 border-gray-400"
                )}
                style={{
                    left: `calc(${percentage}% - 5px)`,
                    transform: isDragging ? "scale(1.25)" : "scale(1)",
                }}
            />

            {/* 提示弹窗 */}
            {ShowTooltip && showPopup && !disabled && (
                <div
                    className="absolute -top-10 px-2 py-1 bg-white border border-blue-400 rounded-md shadow-md pointer-events-none"
                    style={{
                        left: `${percentage}%`,
                        transform: "translateX(-50%)",
                    }}>
                    <span className="text-[12px] text-blue-400 whitespace-nowrap">{GetHintText(value)}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-blue-400 rotate-45" />
                </div>
            )}
        </div>
    );
};

export default PSlider;
