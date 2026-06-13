<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
    /** 当前值 */
    Value: {
        type: Number,
        default: undefined,
    },
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
    className: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["change"]);

const disabled = computed(() => !props.IsEnabled);
const internalValue = ref(props.Min);
const isDragging = ref(false);
const showPopup = ref(false);
const trackRef = ref(null);

const value = computed(() => (props.Value !== undefined ? props.Value : internalValue.value));
const percentage = computed(() => ((value.value - props.Min) / (props.Max - props.Min)) * 100);

const updateValue = (clientX) => {
    if (!trackRef.value || disabled.value) return;

    const rect = trackRef.value.getBoundingClientRect();
    const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
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
        :class="[
            'relative w-full h-4 flex items-center',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className,
        ]"
        ref="trackRef"
        @mousedown="handleMouseDown">
        <!-- 背景线 -->
        <div class="absolute w-full h-1 bg-blue-200/30 rounded-full" />

        <!-- 前景线 -->
        <div class="absolute h-1 bg-blue-400 rounded-full" :style="{ width: `${percentage}%` }" />

        <!-- 滑块点 -->
        <div
            :class="[
                'absolute w-2.5 h-2.5 rounded-full border transition-transform duration-150',
                'bg-blue-100 border-blue-400',
                isDragging && 'scale-125',
                disabled && 'bg-gray-100 border-gray-400',
            ]"
            :style="{
                left: `calc(${percentage}% - 5px)`,
                transform: isDragging ? 'scale(1.25)' : 'scale(1)',
            }" />

        <!-- 提示弹窗 -->
        <div
            v-if="ShowTooltip && showPopup && !disabled"
            class="absolute -top-10 px-2 py-1 bg-white border border-blue-400 rounded-md shadow-md pointer-events-none"
            :style="{
                left: `${percentage}%`,
                transform: 'translateX(-50%)',
            }">
            <span class="text-[12px] text-blue-400 whitespace-nowrap">{{ GetHintText(value) }}</span>
            <div
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-blue-400 rotate-45" />
        </div>
    </div>
</template>
