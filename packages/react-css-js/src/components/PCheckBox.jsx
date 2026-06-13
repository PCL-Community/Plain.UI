import { useState, useCallback } from "react";
import "./PCheckBox.css";

export const PCheckBox = ({
    Checked: controlledChecked,
    IsThreeState = false,
    Text,
    IsEnabled = true,
    onChange,
    onPreviewChange,
    className,
}) => {
    const disabled = !IsEnabled;
    const [internalChecked, setInternalChecked] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const getNextState = useCallback(
        (current) => {
            if (IsThreeState) {
                switch (current) {
                    case true:
                        return null;
                    case false:
                        return true;
                    case null:
                        return false;
                }
            }
            return !current;
        },
        [IsThreeState]
    );

    const handleClick = useCallback(() => {
        if (disabled) return;

        const nextState = getNextState(checked);

        if (onPreviewChange) {
            const allowed = onPreviewChange(nextState);
            if (!allowed) return;
        }

        if (controlledChecked === undefined) {
            setInternalChecked(nextState);
        }
        onChange?.(nextState, true);
    }, [checked, disabled, getNextState, onChange, onPreviewChange, controlledChecked]);

    const handleMouseDown = useCallback(() => {
        if (!disabled) setIsPressed(true);
    }, [disabled]);

    const handleMouseUp = useCallback(() => {
        setIsPressed(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsPressed(false);
        setIsHovered(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const getBoxClass = () => {
        if (disabled) return "pcheckbox__box--disabled";
        if (checked === true) return isHovered ? "pcheckbox__box--checked-hovered" : "pcheckbox__box--checked";
        return isHovered ? "pcheckbox__box--unchecked-hovered" : "pcheckbox__box--unchecked";
    };

    const getTextClass = () => {
        if (disabled) return "pcheckbox__text--disabled";
        if (isHovered) return "pcheckbox__text--hovered";
        return "pcheckbox__text--normal";
    };

    return (
        <label className={`pcheckbox ${disabled ? "pcheckbox--disabled" : ""} ${className || ""}`}>
            <div
                className={`pcheckbox__box ${getBoxClass()}`}
                style={{
                    transform: isPressed ? "scale(0.92)" : "scale(1)",
                }}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {checked === true && (
                    <svg
                        className={`pcheckbox__check ${disabled ? "pcheckbox__check--disabled" : ""}`}
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        style={{
                            transform: isPressed ? "scale(0.9)" : "scale(1)",
                        }}>
                        <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
                    </svg>
                )}

                {checked === null && (
                    <div
                        className={`pcheckbox__indeterminate ${disabled ? "pcheckbox__indeterminate--disabled" : ""}`}
                        style={{
                            transform: isPressed ? "scale(0.9)" : "scale(1)",
                        }}
                    />
                )}
            </div>

            {Text && <span className={`pcheckbox__text ${getTextClass()}`}>{Text}</span>}
        </label>
    );
};

export default PCheckBox;
