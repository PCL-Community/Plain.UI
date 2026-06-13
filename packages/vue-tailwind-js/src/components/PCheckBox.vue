<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 是否选中 */
    Checked: {
        type: [Boolean, Object], // null is treated as Object
        default: undefined,
    },
    /** 是否为三态复选框 */
    IsThreeState: {
        type: Boolean,
        default: false,
    },
    /** 文本 */
    Text: {
        type: String,
        default: "",
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["change", "previewChange"]);

const disabled = computed(() => !props.IsEnabled);
const internalChecked = ref(false);
const isPressed = ref(false);
const isHovered = ref(false);

const checked = computed(() => (props.Checked !== undefined ? props.Checked : internalChecked.value));

const getNextState = (current) => {
    if (props.IsThreeState) {
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
};

const handleClick = () => {
    if (disabled.value) return;

    const nextState = getNextState(checked.value);

    // 预览事件，可取消
    if (emit("previewChange", nextState) === false) return;

    if (props.Checked === undefined) {
        internalChecked.value = nextState;
    }
    emit("change", nextState, true);
};

const handleMouseDown = () => {
    if (!disabled.value) isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};

const handleMouseLeave = () => {
    isPressed.value = false;
    isHovered.value = false;
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

// 边框颜色
const getBorderColor = () => {
    if (disabled.value) return "border-gray-400";
    if (checked.value === true) return isHovered.value ? "border-blue-500" : "border-blue-400";
    return isHovered.value ? "border-blue-500" : "border-blue-400";
};

// 背景颜色
const getBackgroundColor = () => {
    if (disabled.value) return "bg-gray-100";
    if (isPressed.value && checked.value === true) return "bg-blue-100";
    return "bg-white/50";
};

// 文本颜色
const getTextColor = () => {
    if (disabled.value) return "text-gray-400";
    if (isHovered.value) return "text-blue-500";
    return "text-blue-400";
};

const borderColorClass = computed(getBorderColor);
const backgroundColorClass = computed(getBackgroundColor);
const textColorClass = computed(getTextColor);
</script>

<template>
    <label
        :class="[
            'inline-flex items-center gap-2 cursor-pointer select-none',
            disabled && 'cursor-not-allowed',
            className,
        ]">
        <div
            :class="[
                'relative size-4.5 rounded-[3px] border transition-all duration-150',
                'flex items-center justify-center',
                borderColorClass,
                backgroundColorClass,
            ]"
            :style="{
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 100ms ease-out, background-color 150ms, border-color 150ms',
            }"
            @click="handleClick"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <!-- 勾选标记 -->
            <svg
                v-if="checked === true"
                :class="['w-3 h-3 transition-all duration-150', disabled ? 'text-gray-400' : 'text-blue-400']"
                viewBox="0 0 12 12"
                fill="currentColor"
                :style="{
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                    transition: 'transform 100ms ease-out',
                }">
                <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
            </svg>

            <!-- 不确定状态标记 -->
            <div
                v-if="checked === null"
                :class="['w-2.5 h-2.5 rounded-xs', disabled ? 'bg-gray-400' : 'bg-blue-400']"
                :style="{
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                    transition: 'transform 100ms ease-out',
                }" />
        </div>

        <span v-if="Text" :class="['text-[13px] transition-colors duration-150', textColorClass]">{{ Text }}</span>
    </label>
</template>
