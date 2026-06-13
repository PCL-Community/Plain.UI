import { useState, useCallback } from "react";
import { clsx } from "clsx";

export type PHintTheme = "Blue" | "Red" | "Yellow";

export interface PHintProps {
    /** 提示文本 */
    Text: string;
    /** 提示主题 */
    Theme?: PHintTheme;
    /** 是否可关闭 */
    CanClose?: boolean;
    /** 关闭事件 */
    onClose?: () => void;
    /** 自定义类名 */
    className?: string;
}

const themeConfig = {
    Red: {
        borderColor: "border-l-red-400",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        iconColor: "text-red-400",
    },
    Yellow: {
        borderColor: "border-l-yellow-400",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        iconColor: "text-yellow-500",
    },
    Blue: {
        borderColor: "border-l-blue-400",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        iconColor: "text-blue-400",
    },
};

export const PHint: React.FC<PHintProps> = ({ Text, Theme = "Blue", CanClose = false, onClose, className }) => {
    const [isVisible, setIsVisible] = useState(true);
    const config = themeConfig[Theme];

    const handleClose = useCallback(() => {
        setIsVisible(false);
        onClose?.();
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={clsx(
                "flex items-center justify-between",
                "border-l-[3px] rounded-r-xs",
                config.borderColor,
                config.bgColor,
                className
            )}>
            <span
                className={clsx("flex-1 py-2.5 px-3 text-[13px] leading-4", config.textColor)}
                style={{
                    lineHeight: "16px",
                    marginBottom: "-1px",
                }}>
                {Text}
            </span>

            {CanClose && (
                <button
                    type="button"
                    onClick={handleClose}
                    className={clsx(
                        "p-2 mr-2 rounded-full transition-colors duration-150",
                        "hover:bg-black/5",
                        config.iconColor
                    )}
                    title="不再显示">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2,0 L0,2 8,10 0,18 2,20 10,12 18,20 20,18 12,10 20,2 18,0 10,8 2,0Z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default PHint;
