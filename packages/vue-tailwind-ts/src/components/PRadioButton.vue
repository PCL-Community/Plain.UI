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

const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);

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
const backgroundColorClass = computed(() => {
    if (disabled.value) return "bg-gray-200";
    if (props.Checked) return "bg-blue-400";
    if (isHovered.value) return "bg-blue-100";
    return "bg-transparent";
});

// 文本颜色
const textColorClass = computed(() => {
    if (disabled.value) return "text-gray-400";
    if (props.Checked) return "text-white";
    if (isHovered.value) return "text-blue-500";
    return "text-blue-400";
});

// 图标颜色
const iconColorClass = computed(() => {
    if (disabled.value) return "text-gray-400";
    if (props.Checked) return "text-white";
    return "text-blue-400";
});
</script>

<template>
    <button
        type="button"
        :class="[
            'inline-flex items-center rounded-full transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            backgroundColorClass,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            props.className,
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
        :aria-checked="props.Checked"
        role="radio">
        <!-- 图标 -->
        <svg
            v-if="props.Logo"
            :class="['w-4 h-4 mr-2 shrink-0', iconColorClass]"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="props.Logo" />
        </svg>

        <!-- 文本 -->
        <span v-if="props.Text" :class="['text-[13px] whitespace-nowrap', textColorClass]">
            {{ props.Text }}
        </span>
    </button>
</template>
