<script setup lang="ts">
import { ref, onUnmounted, watch } from "vue";

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

const props = withDefaults(defineProps<PLoadingProps>(), {
    Text: "Loading",
    State: "loading",
    Foreground: "#60A5FA",
    className: "",
});

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

const rotation = ref(55);
const sparkles = ref({ left: false, right: false });
const errorScale = ref(0);
let animationRef: number | null = null;
let startTimeRef: number | undefined;

const runAnimationCycle = () => {
    if (props.State !== "loading") return;

    const animate = (timestamp: number) => {
        if (!startTimeRef) startTimeRef = timestamp;
        const elapsed = timestamp - startTimeRef;

        // 一个完整周期约 2300ms
        // 0-350ms: 向后仰 (windup)
        // 350-900ms: 砸下去 (strike)
        // 900-1200ms: 火花效果 (sparkle)
        // 1200-2100ms: 抬起来/回弹 (raise)

        if (elapsed < 350) {
            // 阶段1: 向后仰 (从55度到35度)
            const progress = elapsed / 350;
            const eased = easeInBack(progress);
            rotation.value = 55 - 20 * eased;
            sparkles.value = { left: false, right: false };
        } else if (elapsed < 900) {
            // 阶段2: 砸下去 (从35度到-15度)
            const progress = (elapsed - 350) / 550;
            const eased = easeOutFluent(progress);
            rotation.value = 35 - 50 * eased;
            sparkles.value = { left: false, right: false };
        } else if (elapsed < 1200) {
            // 阶段3: 火花效果 (镐子保持在-15度)
            rotation.value = -15;
            const sparkleProgress = (elapsed - 900) / 300;
            sparkles.value = {
                left: sparkleProgress < 0.6,
                right: sparkleProgress > 0.2 && sparkleProgress < 0.8,
            };
        } else if (elapsed < 2100) {
            // 阶段4: 抬起来 (从-15度回到55度)
            const progress = (elapsed - 1200) / 900;
            const eased = easeOutElastic(progress);
            rotation.value = -15 + 70 * eased;
            sparkles.value = { left: false, right: false };
        } else {
            // 重置开始下一轮
            startTimeRef = timestamp;
            sparkles.value = { left: false, right: false };
        }

        animationRef = requestAnimationFrame(animate);
    };

    animationRef = requestAnimationFrame(animate);
};

// 错误动画
const runErrorAnimation = () => {
    let startTime: number | undefined;
    const animateError = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / 400, 1);
        const eased = easeOutElastic(progress);
        errorScale.value = eased;

        if (progress < 1) {
            requestAnimationFrame(animateError);
        }
    };
    requestAnimationFrame(animateError);
};

// 监听状态变化
watch(
    () => props.State,
    (newState) => {
        if (animationRef) {
            cancelAnimationFrame(animationRef);
            animationRef = null;
        }

        if (newState === "loading") {
            startTimeRef = undefined;
            runAnimationCycle();
        } else if (newState === "error") {
            errorScale.value = 0;
            runErrorAnimation();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    if (animationRef) {
        cancelAnimationFrame(animationRef);
    }
});
</script>

<template>
    <div :class="['flex flex-col items-center justify-center min-w-12.5 min-h-12.5', props.className]">
        <!-- 镐子动画区域 -->
        <div class="relative w-15 h-11.75">
            <!-- 镐子 -->
            <svg
                v-if="props.State === 'loading'"
                class="absolute top-1.5 left-2.5 size-8.75"
                viewBox="0 0 1000 1000"
                :style="{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '30px 30px',
                }">
                <path
                    d="M963.6 858.2L410.816 305.504C508.116 213.304 609.204 196.8 711.104 128.6 837.11367 49.573762 879.34045 50.334062 751.5 49.5 611.3 52 471.8 96.2 353.3 182.4 309.8 155.7 252.1 161.2 214.5 198.9 176.9 236.6 171.3 294.2 198 337.7 111.8 456.3 67.6 595.8 65.1 735.9 63.315254 883.82034 65.077966 837.29308 144.2 695.488 212.4 593.588 228.888 492.4 321.088 395.2L873.9 948c0.60001 0.59999 1.6 0.6 2.2 0l87.5-87.5c0.6-0.7 0.6-1.6 0-2.3z"
                    fill="none"
                    :stroke="props.Foreground"
                    stroke-width="20"
                />
            </svg>

            <!-- 成功图标 -->
            <svg
                v-if="props.State === 'success'"
                class="absolute top-2.5 left-2.5 size-10"
                viewBox="0 0 24 24"
                :fill="props.Foreground">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>

            <!-- 错误图标 -->
            <svg
                v-if="props.State === 'error'"
                class="absolute top-2.5 left-2.5 size-10"
                viewBox="0 0 24 24"
                :fill="props.Foreground"
                :style="{
                    transform: `scale(${errorScale})`,
                    transformOrigin: 'center',
                }">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>

            <!-- 火花效果 - 左 -->
            <div
                v-if="props.State === 'loading'"
                :class="[
                    'absolute bottom-0.5 left-2 w-0.75 h-1.25 rounded-[1px] transition-opacity duration-75',
                    sparkles.left ? 'opacity-100' : 'opacity-0',
                ]"
                :style="{
                    backgroundColor: props.Foreground,
                    transform: 'rotate(-45deg)',
                }"
            />

            <!-- 火花效果 - 右 -->
            <div
                v-if="props.State === 'loading'"
                :class="[
                    'absolute bottom-0.5 left-3.5 w-0.75 h-1.25 rounded-[1px] transition-opacity duration-75',
                    sparkles.right ? 'opacity-100' : 'opacity-0',
                ]"
                :style="{
                    backgroundColor: props.Foreground,
                    transform: 'rotate(45deg)',
                }"
            />

            <!-- 底部线条 -->
            <div
                class="absolute bottom-0 left-0 w-6.25 h-0.5 rounded-full"
                :style="{ backgroundColor: props.Foreground }"
            />
        </div>

        <!-- 加载文本 -->
        <span class="mt-2.5 text-[16px] font-medium" :style="{ color: props.Foreground }">
            {{ props.Text }}
        </span>
    </div>
</template>
