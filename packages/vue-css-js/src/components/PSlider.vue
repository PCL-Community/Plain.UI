<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
    /** 当前值 */
    Value: Number,
    /** 最小值 */
    Min: {
        type: Number,
        default: 0,
    },
    /** 最大值 */
    Max: {
        type: Number,
        default: 100,
    },
    /** 步长 */
    Step: {
        type: Number,
        default: 1,
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 是否显示提示 */
    ShowTooltip: {
        type: Boolean,
        default: true,
    },
    /** 提示格式化函数 */
    GetHintText: {
        type: Function,
        default: (v) => String(v),
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["change"]);

const internalValue = ref(props.Min);
const isDragging = ref(false);
const showPopup = ref(false);
const trackRef = ref(null);

const disabled = computed(() => !props.IsEnabled);

const value = computed(() =>
    props.Value !== undefined ? props.Value : internalValue.value
);

const percentage = computed(
    () => ((value.value - props.Min) / (props.Max - props.Min)) * 100
);

const updateValue = (clientX) => {
    if (!trackRef.value || disabled.value) return;

    const rect = trackRef.value.getBoundingClientRect();
    const newPercentage = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    const newValue = props.Min + (newPercentage / 100) * (props.Max - props.Min);
    const steppedValue = Math.round(newValue / props.Step) * props.Step;
    const clampedValue = Math.max(props.Min, Math.min(props.Max, steppedValue));

    if (props.Value === undefined) {
        internalValue.value = clampedValue;
    }
    emit("change", clampedValue);
};

const handleMouseDown = (e) => {
    if (disabled.value) return;
    isDragging.value = true;
    showPopup.value = true;
    updateValue(e.clientX);
};

const handleMouseMove = (e) => {
    if (isDragging.value) {
        updateValue(e.clientX);
    }
};

const handleMouseUp = () => {
    isDragging.value = false;
    showPopup.value = false;
};

onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<template>
    <div
        ref="trackRef"
        class="p-slider"
        :class="[className, { 'p-slider--disabled': disabled }]"
        @mousedown="handleMouseDown">
        <!-- 背景线 -->
        <div class="p-slider__track-bg" />

        <!-- 前景线 -->
        <div
            class="p-slider__track-fill"
            :style="{ width: `${percentage}%` }" />

        <!-- 滑块点 -->
        <div
            class="p-slider__thumb"
            :class="{ 'p-slider__thumb--dragging': isDragging }"
            :style="{
                left: `calc(${percentage}% - 5px)`,
                transform: isDragging ? 'scale(1.25)' : 'scale(1)',
            }" />

        <!-- 提示弹窗 -->
        <div
            v-if="ShowTooltip && showPopup && !disabled"
            class="p-slider__tooltip"
            :style="{ left: `${percentage}%` }">
            <span class="p-slider__tooltip-text">{{ GetHintText(value) }}</span>
            <div class="p-slider__tooltip-arrow" />
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

.p-slider--disabled {
    cursor: not-allowed;
}

.p-slider__track-bg {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: rgba(191, 219, 254, 0.3);
    border-radius: 9999px;
}

.p-slider__track-fill {
    position: absolute;
    height: 4px;
    background-color: #60a5fa;
    border-radius: 9999px;
}

.p-slider__thumb {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #60a5fa;
    background-color: #dbeafe;
    transition: transform 150ms;
}

.p-slider__thumb--dragging {
    transform: scale(1.25);
}

.p-slider--disabled .p-slider__thumb {
    background-color: #f3f4f6;
    border-color: #9ca3af;
}

.p-slider__tooltip {
    position: absolute;
    top: -40px;
    padding: 4px 8px;
    background-color: white;
    border: 1px solid #60a5fa;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    transform: translateX(-50%);
}

.p-slider__tooltip-text {
    font-size: 12px;
    color: #60a5fa;
    white-space: nowrap;
}

.p-slider__tooltip-arrow {
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
