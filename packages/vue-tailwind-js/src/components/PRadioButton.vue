<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 是否选中 */
    Checked: {
        type: Boolean,
        default: false,
    },
    /** 文本 */
    Text: {
        type: String,
        default: "",
    },
    /** 图标 (SVG path) */
    Logo: {
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

const emit = defineEmits(["change"]);

const disabled = computed(() => !props.IsEnabled);
const isHovered = ref(false);

const handleClick = () => {
    if (!disabled.value && !props.Checked) {
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
const getBackgroundColor = () => {
    if (disabled.value) return "bg-gray-200";
    if (props.Checked) return "bg-blue-400";
    if (isHovered.value) return "bg-blue-100";
    return "bg-transparent";
};

// 文本颜色
const getTextColor = () => {
    if (disabled.value) return "text-gray-400";
    if (props.Checked) return "text-white";
    if (isHovered.value) return "text-blue-500";
    return "text-blue-400";
};

// 图标颜色
const getIconColor = () => {
    if (disabled.value) return "text-gray-400";
    if (props.Checked) return "text-white";
    return "text-blue-400";
};

const backgroundColorClass = computed(getBackgroundColor);
const textColorClass = computed(getTextColor);
const iconColorClass = computed(getIconColor);
</script>

<template>
    <button
        type="button"
        :class="[
            'inline-flex items-center rounded-full transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            backgroundColorClass,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className,
        ]"
        :style="{
            minHeight: '27px',
            maxHeight: '27px',
            padding: '0 12px',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :aria-checked="Checked"
        role="radio">
        <!-- 图标 -->
        <svg
            v-if="Logo"
            :class="['w-4 h-4 mr-2 shrink-0', iconColorClass]"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span v-if="Text" :class="['text-[13px] whitespace-nowrap', textColorClass]">{{ Text }}</span>
    </button>
</template>
