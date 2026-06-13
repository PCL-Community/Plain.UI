<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 文本 */
    Text: {
        type: String,
        required: true,
    },
    /** 图标 (SVG path) */
    Logo: String,
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
    /** 标题/提示 */
    ToolTip: String,
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
        :title="ToolTip || Text"
        class="p-extra-text-button"
        :class="[className, { 'p-extra-text-button--disabled': disabled }]"
        :style="{
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 背景层 -->
        <div
            class="p-extra-text-button__bg"
            :class="{ 'p-extra-text-button__bg--pressed': isPressed }" />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            class="p-extra-text-button__icon"
            :class="{ 'p-extra-text-button__icon--disabled': disabled }"
            :width="iconSize"
            :height="iconSize"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            }">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span
            class="p-extra-text-button__text"
            :class="{ 'p-extra-text-button__text--disabled': disabled }">
            {{ Text }}
        </span>
    </button>
</template>

<style scoped>
.p-extra-text-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    border-radius: 9999px;
    overflow: hidden;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-extra-text-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-extra-text-button--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-extra-text-button__bg {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background-color: #60a5fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 150ms;
}

.p-extra-text-button__bg--pressed {
    background-color: #3b82f6;
}

.p-extra-text-button__icon {
    position: relative;
    z-index: 10;
    color: white;
    transition: transform 80ms ease-out;
    flex-shrink: 0;
}

.p-extra-text-button__icon--disabled {
    color: rgba(255, 255, 255, 0.5);
}

.p-extra-text-button__text {
    position: relative;
    z-index: 10;
    font-size: 16px;
    font-weight: 500;
    color: white;
    transition: color 150ms;
}

.p-extra-text-button__text--disabled {
    color: rgba(255, 255, 255, 0.5);
}
</style>
