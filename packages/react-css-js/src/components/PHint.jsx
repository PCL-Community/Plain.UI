import { useState, useCallback } from "react";
import "./PHint.css";

export const PHint = ({ Text, Theme = "Blue", CanClose = false, onClose, className }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        onClose?.();
    }, [onClose]);

    if (!isVisible) return null;

    const getThemeClass = () => `phint--${Theme.toLowerCase()}`;

    return (
        <div className={`phint ${getThemeClass()} ${className || ""}`}>
            <span className="phint__text">{Text}</span>

            {CanClose && (
                <button
                    type="button"
                    onClick={handleClose}
                    className="phint__close"
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
