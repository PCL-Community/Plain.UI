<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 是否选中 */
    Checked: {
        type: Boolean,
        default: false,
    },
    /** 文本 */
    Text: String,
    /** 图标 (SVG path) */
    Logo: String,
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["change"]);

const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);

const handleClick = () => {
    if (!disabled.value && !props.Checked) {
        emit("change", true);
    }
};

const handleMouseEnter = () => {
    setIsHovered(true);
};

const handleMouseLeave = () => {
    setIsHovered(false);
};

const setIsHovered = (value) => {
    isHovered.value = value;
};

// 背景颜色 - 选中时为蓝色，未选中时透明
const backgroundColor = computed(() => {
    if (disabled.value) return "#e5e7eb";
    if (props.Checked) return "#60a5fa";
    if (isHovered.value) return "#dbeafe";
    return "transparent";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    if (props.Checked) return "#ffffff";
    if (isHovered.value) return "#3b82f6";
    return "#60a5fa";
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    if (props.Checked) return "#ffffff";
    return "#60a5fa";
});
</script>

<template>
    <button
        type="button"
        class="p-radio-button"
        :class="[className, { 'p-radio-button--disabled': disabled }]"
        :style="{ backgroundColor: backgroundColor }"
        :disabled="disabled"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :aria-checked="Checked"
        role="radio">
        <!-- 图标 -->
        <svg
            v-if="Logo"
            class="p-radio-button__icon"
            :style="{ color: iconColor }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span
            v-if="Text"
            class="p-radio-button__text"
            :style="{ color: textColor }">
            {{ Text }}
        </span>
    </button>
</template>

<style scoped>
.p-radio-button {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    min-height: 27px;
    max-height: 27px;
    padding: 0 12px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 200ms;
}

.p-radio-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-radio-button--disabled {
    cursor: not-allowed;
}

.p-radio-button__icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
    transition: color 200ms;
}

.p-radio-button__text {
    font-size: 13px;
    white-space: nowrap;
    transition: color 200ms;
}
</style>
