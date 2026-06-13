<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

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

const props = withDefaults(defineProps<PSliderProps>(), {
    Value: undefined,
    Min: 0,
    Max: 100,
    Step: 1,
    IsEnabled: true,
    ShowTooltip: true,
    GetHintText: (v: number) => String(v),
    className: "",
});

const emit = defineEmits<{
    change: [value: number];
}>();

const disabled = computed(() => !props.IsEnabled);
const internalValue = ref(props.Min);
const isDragging = ref(false);
const showPopup = ref(false);
const trackRef = ref<HTMLDivElement | null>(null);

const value = computed(() => props.Value !== undefined ? props.Value : internalValue.value);
const percentage = computed(() => ((value.value - props.Min) / (props.Max - props.Min)) * 100);

const updateValue = (clientX: number) => {
    if (!trackRef.value || disabled.value) return;

    const rect = trackRef.value.getBoundingClientRect();
    const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = props.Min + (newPercentage / 100) * (props.Max - props.Min);
    const steppedValue = Math.round(newValue / props.Step) * props.Step;
    const clampedValue = Math.max(props.Min, Math.min(props.Max, steppedValue));

    if (props.Value === undefined) {
        internalValue.value = clampedValue;
    }
    props.onChange?.(clampedValue);
    emit("change", clampedValue);
};

const handleMouseDown = (e: MouseEvent) => {
    if (disabled.value) return;
    isDragging.value = true;
    showPopup.value = true;
    updateValue(e.clientX);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
        updateValue(e.clientX);
    }
};

const handleMouseUp = () => {
    isDragging.value = false;
    showPopup.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
};

onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<template>
    <div
        class="p-slider"
        :class="[className, { disabled }]"
        ref="trackRef"
        @mousedown="handleMouseDown">
        <!-- 背景线 -->
        <div class="p-slider-track" />

        <!-- 前景线 -->
        <div
            class="p-slider-fill"
            :style="{ width: `${percentage}%` }"
        />

        <!-- 滑块点 -->
        <div
            class="p-slider-thumb"
            :class="{ dragging: isDragging }"
            :style="{
                left: `calc(${percentage}% - 5px)`,
                transform: isDragging ? 'scale(1.25)' : 'scale(1)',
            }"
        />

        <!-- 提示弹窗 -->
        <div
            v-if="ShowTooltip && showPopup && !disabled"
            class="p-slider-tooltip"
            :style="{ left: `${percentage}%` }">
            <span class="p-slider-tooltip-text">{{ GetHintText(value) }}</span>
            <div class="p-slider-tooltip-arrow" />
        </div>
    </div>
</template>

<style scoped>
.p-slider {
    position: relative;
    width: 100%;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.p-slider.disabled {
    cursor: not-allowed;
}

.p-slider-track {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: rgba(147, 197, 253, 0.3);
    border-radius: 9999px;
}

.p-slider-fill {
    position: absolute;
    height: 4px;
    background-color: #60a5fa;
    border-radius: 9999px;
}

.p-slider-thumb {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #60a5fa;
    background-color: #dbeafe;
    transition: transform 150ms;
}

.p-slider-thumb.dragging {
    transform: scale(1.25);
}

.p-slider.disabled .p-slider-thumb {
    background-color: #f3f4f6;
    border-color: #9ca3af;
}

.p-slider-tooltip {
    position: absolute;
    top: -40px;
    padding: 4px 8px;
    background-color: white;
    border: 1px solid #60a5fa;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    transform: translateX(-50%);
}

.p-slider-tooltip-text {
    font-size: 12px;
    color: #60a5fa;
    white-space: nowrap;
}

.p-slider-tooltip-arrow {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: white;
    border-right: 1px solid #60a5fa;
    border-bottom: 1px solid #60a5fa;
}
</style>
