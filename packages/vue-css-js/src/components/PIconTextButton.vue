<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 文本 */
    Text: {
        type: String,
        required: true,
    },
    /** 图标 (SVG path) */
    Logo: {
        type: String,
        required: true,
    },
    /** 图标大小 */
    LogoScale: {
        type: Number,
        default: 1,
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["click"]);

const isPressed = ref(false);
const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);

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

const handleClick = (event) => {
    if (!disabled.value) emit("click", event);
};

const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        class="p-icon-text-button"
        :class="[className, { 'p-icon-text-button--disabled': disabled }]"
        :style="{
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
            opacity: isHovered && !disabled ? 0.9 : 1,
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 图标 -->
        <svg
            class="p-icon-text-button__icon"
            :width="iconSize"
            :height="iconSize"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
            }">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span class="p-icon-text-button__text">{{ Text }}</span>
    </button>
</template>

<style scoped>
.p-icon-text-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 13.5px;
    background-color: rgba(0, 0, 0, 0.1);
    min-height: 27px;
    max-height: 27px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 80ms ease-out, opacity 150ms;
}

.p-icon-text-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.p-icon-text-button--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-icon-text-button__icon {
    color: white;
    flex-shrink: 0;
    transition: transform 80ms ease-out;
}

.p-icon-text-button__text {
    font-size: 13px;
    color: white;
    white-space: nowrap;
}
</style>
