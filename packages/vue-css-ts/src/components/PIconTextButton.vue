<script setup lang="ts">
import { ref, computed } from "vue";

export interface PIconTextButtonProps {
    /** 文本 */
    Text: string;
    /** 图标 (SVG path) */
    Logo: string;
    /** 图标大小 */
    LogoScale?: number;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: (event: MouseEvent) => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PIconTextButtonProps>(), {
    LogoScale: 1,
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const disabled = computed(() => !props.IsEnabled);
const isPressed = ref(false);
const isHovered = ref(false);

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

const handleClick = (event: MouseEvent) => {
    if (!disabled.value) {
        props.onClick?.(event);
        emit("click", event);
    }
};

const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        class="p-icon-text-button"
        :class="[className, { disabled }]"
        :style="{
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
            opacity: disabled ? 0.5 : isHovered ? 0.9 : 1,
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 图标 -->
        <svg
            class="p-icon-text-button-icon"
            :style="{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
            }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span class="p-icon-text-button-text">{{ Text }}</span>
    </button>
</template>

<style scoped>
.p-icon-text-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    min-height: 27px;
    max-height: 27px;
    border-radius: 13.5px;
    background-color: rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 80ms ease-out, opacity 150ms;
}

.p-icon-text-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.p-icon-text-button.disabled {
    cursor: not-allowed;
}

.p-icon-text-button-icon {
    color: white;
    flex-shrink: 0;
    transition: transform 80ms ease-out;
}

.p-icon-text-button-text {
    font-size: 13px;
    color: white;
    white-space: nowrap;
}
</style>
