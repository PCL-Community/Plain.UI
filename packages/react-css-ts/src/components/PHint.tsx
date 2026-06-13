import { useState, useCallback } from "react";
import "./PHint.css";

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
        borderColor: "#f87171",
        bgColor: "#fef2f2",
        textColor: "#dc2626",
        iconColor: "#f87171",
    },
    Yellow: {
        borderColor: "#facc15",
        bgColor: "#fefce8",
        textColor: "#a16207",
        iconColor: "#eab308",
    },
    Blue: {
        borderColor: "#60a5fa",
        bgColor: "#eff6ff",
        textColor: "#2563eb",
        iconColor: "#60a5fa",
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
            className={`phint ${className || ""}`}
            style={{
                borderLeftColor: config.borderColor,
                backgroundColor: config.bgColor,
            }}>
            <span
                className="phint__text"
                style={{ color: config.textColor }}>
                {Text}
            </span>

            {CanClose && (
                <button
                    type="button"
                    onClick={handleClose}
                    className="phint__close"
                    style={{ color: config.iconColor }}
                    title="不再显示">
                    <svg className="phint__close-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2,0 L0,2 8,10 0,18 2,20 10,12 18,20 20,18 12,10 20,2 18,0 10,8 2,0Z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default PHint;
