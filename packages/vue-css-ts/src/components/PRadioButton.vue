<script setup lang="ts">
import { ref, computed } from "vue";

export interface PRadioButtonProps {
    /** 是否选中 */
    Checked?: boolean;
    /** 文本 */
    Text?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 变更事件 */
    onChange?: (checked: boolean) => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PRadioButtonProps>(), {
    Checked: false,
    Text: "",
    Logo: "",
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    change: [checked: boolean];
}>();

const disabled = computed(() => !props.IsEnabled);
const isHovered = ref(false);

const handleClick = () => {
    if (!disabled.value && !props.Checked) {
        props.onChange?.(true);
        emit("change", true);
    }
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
};

// 背景颜色 - 选中时为蓝色，未选中时透明
const backgroundColor = computed(() => {
    if (disabled.value) return "#e5e7eb"; // gray-200
    if (props.Checked) return "#60a5fa"; // blue-400
    if (isHovered.value) return "#dbeafe"; // blue-100
    return "transparent";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (props.Checked) return "#ffffff"; // white
    if (isHovered.value) return "#3b82f6"; // blue-500
    return "#60a5fa"; // blue-400
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (props.Checked) return "#ffffff"; // white
    return "#60a5fa"; // blue-400
});
</script>

<template>
    <button
        type="button"
        class="p-radio-button"
        :class="[className, { disabled }]"
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
            class="p-radio-icon"
            :style="{ color: iconColor }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span v-if="Text" class="p-radio-text" :style="{ color: textColor }">{{ Text }}</span>
    </button>
</template>

<style scoped>
.p-radio-button {
    display: inline-flex;
    align-items: center;
    min-height: 27px;
    max-height: 27px;
    padding: 0 12px;
    border-radius: 9999px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 200ms;
}

.p-radio-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-radio-button.disabled {
    cursor: not-allowed;
}

.p-radio-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
}

.p-radio-text {
    font-size: 13px;
    white-space: nowrap;
}
</style>
