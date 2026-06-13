import { useState, useEffect, useRef, useCallback } from "react";
import "./PLoading.css";

export type PLoadingState = "loading" | "success" | "error";

export interface PLoadingProps {
    /** 加载文本 */
    Text?: string;
    /** 状态 */
    State?: PLoadingState;
    /** 前景色 */
    Foreground?: string;
    /** 自定义类名 */
    className?: string;
}

// 缓动函数
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

const easeOutFluent = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
};

const easeInBack = (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
};

export const PLoading: React.FC<PLoadingProps> = ({
    Text = "Loading",
    State = "loading",
    Foreground = "#60A5FA",
    className,
}) => {
    const [rotation, setRotation] = useState(55);
    const [sparkles, setSparkles] = useState({ left: false, right: false });
    const [errorScale, setErrorScale] = useState(0);
    const animationRef = useRef<number>();
    const phaseRef = useRef<"idle" | "windup" | "strike" | "bounce" | "sparkle">("idle");
    const startTimeRef = useRef<number>();

    const runAnimationCycle = useCallback(() => {
        if (State !== "loading") return;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;

            // 一个完整周期约 2300ms
            // 0-350ms: 向后仰 (windup)
            // 350-900ms: 砸下去 (strike)
            // 900-1200ms: 火花效果 (sparkle)
            // 1200-2100ms: 抬起来/回弹 (raise)

            if (elapsed < 350) {
                // 阶段1: 向后仰 (从55度到35度)
                phaseRef.current = "windup";
                const progress = elapsed / 350;
                const eased = easeInBack(progress);
                setRotation(55 - 20 * eased);
                setSparkles({ left: false, right: false });
            } else if (elapsed < 900) {
                // 阶段2: 砸下去 (从35度到-15度)
                phaseRef.current = "strike";
                const progress = (elapsed - 350) / 550;
                const eased = easeOutFluent(progress);
                setRotation(35 - 50 * eased);
                setSparkles({ left: false, right: false });
            } else if (elapsed < 1200) {
                // 阶段3: 火花效果 (镐子保持在-15度)
                phaseRef.current = "sparkle";
                setRotation(-15);
                const sparkleProgress = (elapsed - 900) / 300;
                setSparkles({
                    left: sparkleProgress < 0.6,
                    right: sparkleProgress > 0.2 && sparkleProgress < 0.8,
                });
            } else if (elapsed < 2100) {
                // 阶段4: 抬起来 (从-15度回到55度)
                phaseRef.current = "bounce";
                const progress = (elapsed - 1200) / 900;
                const eased = easeOutElastic(progress);
                setRotation(-15 + 70 * eased);
                setSparkles({ left: false, right: false });
            } else {
                // 重置开始下一轮
                startTimeRef.current = timestamp;
                setSparkles({ left: false, right: false });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [State]);

    // 错误动画
    useEffect(() => {
        if (State === "error") {
            let startTime: number;
            const animateError = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / 400, 1);
                const eased = easeOutElastic(progress);
                setErrorScale(eased);

                if (progress < 1) {
                    requestAnimationFrame(animateError);
                }
            };
            requestAnimationFrame(animateError);
        } else {
            setErrorScale(0);
        }
    }, [State]);

    // 主动画循环
    useEffect(() => {
        if (State === "loading") {
            startTimeRef.current = undefined;
            runAnimationCycle();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [State, runAnimationCycle]);

    return (
        <div className={`ploading ${className || ""}`}>
            {/* 镐子动画区域 */}
            <div className="ploading__animation">
                {/* 镐子 */}
                {State === "loading" && (
                    <svg
                        className="ploading__pickaxe"
                        viewBox="0 0 1000 1000"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin: "30px 30px",
                        }}>
                        <path
                            d="M963.6 858.2L410.816 305.504C508.116 213.304 609.204 196.8 711.104 128.6 837.11367 49.573762 879.34045 50.334062 751.5 49.5 611.3 52 471.8 96.2 353.3 182.4 309.8 155.7 252.1 161.2 214.5 198.9 176.9 236.6 171.3 294.2 198 337.7 111.8 456.3 67.6 595.8 65.1 735.9 63.315254 883.82034 65.077966 837.29308 144.2 695.488 212.4 593.588 228.888 492.4 321.088 395.2L873.9 948c0.60001 0.59999 1.6 0.6 2.2 0l87.5-87.5c0.6-0.7 0.6-1.6 0-2.3z"
                            fill="none"
                            stroke={Foreground}
                            strokeWidth="20"
                        />
                    </svg>
                )}

                {/* 成功图标 */}
                {State === "success" && (
                    <svg className="ploading__icon ploading__icon--success" viewBox="0 0 24 24" fill={Foreground}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                )}

                {/* 错误图标 */}
                {State === "error" && (
                    <svg
                        className="ploading__icon ploading__icon--error"
                        viewBox="0 0 24 24"
                        fill={Foreground}
                        style={{
                            transform: `scale(${errorScale})`,
                            transformOrigin: "center",
                        }}>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                )}

                {/* 火花效果 - 左 */}
                {State === "loading" && (
                    <div
                        className={`ploading__sparkle ploading__sparkle--left ${sparkles.left ? "ploading__sparkle--visible" : ""}`}
                        style={{ backgroundColor: Foreground }}
                    />
                )}

                {/* 火花效果 - 右 */}
                {State === "loading" && (
                    <div
                        className={`ploading__sparkle ploading__sparkle--right ${sparkles.right ? "ploading__sparkle--visible" : ""}`}
                        style={{ backgroundColor: Foreground }}
                    />
                )}

                {/* 底部线条 */}
                <div className="ploading__base" style={{ backgroundColor: Foreground }} />
            </div>

            {/* 加载文本 */}
            <span className="ploading__text" style={{ color: Foreground }}>
                {Text}
            </span>
        </div>
    );
};

export default PLoading;
