<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 标题 */
    Title: {
        type: String,
        required: true,
    },
    /** 信息/副标题 */
    Info: String,
    /** 图标 (SVG path) */
    Logo: String,
    /** 是否选中 */
    Checked: {
        type: Boolean,
        default: false,
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

const isHovered = ref(false);
const isPressed = ref(false);

const disabled = computed(() => !props.IsEnabled);

const handleClick = () => {
    if (!disabled.value) emit("click");
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
    isPressed.value = false;
};

const handleMouseDown = () => {
    if (!disabled.value) isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};

// 指示条颜色
const indicatorColor = computed(() =>
    props.Checked ? "#60a5fa" : "transparent"
);

// 图标颜色
const iconColor = computed(() => {
    if (props.Checked) return "#60a5fa";
    if (isHovered.value && !disabled.value && !props.Checked) return "#93c5fd";
    return "#9ca3af";
});

// 标题颜色
const titleColor = computed(() => {
    if (props.Checked) return "#3b82f6";
    if (isHovered.value && !disabled.value && !props.Checked) return "#60a5fa";
    return "#374151";
});
</script>

<template>
    <div
        class="p-list-item"
        :class="[
            className,
            { 'p-list-item--disabled': disabled },
            { 'p-list-item--checked': Checked },
        ]"
        :style="{
            transform: isPressed ? 'scale(0.995)' : 'scale(1)',
        }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp">
        <!-- 左侧指示条 -->
        <div
            class="p-list-item__indicator"
            :style="{ backgroundColor: indicatorColor }" />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            class="p-list-item__icon"
            :style="{ color: iconColor }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 内容区域 -->
        <div class="p-list-item__content">
            <div
                class="p-list-item__title"
                :class="{ 'p-list-item__title--checked': Checked }"
                :style="{ color: titleColor }">
                {{ Title }}
            </div>
            <div v-if="Info" class="p-list-item__info">{{ Info }}</div>
        </div>
    </div>
</template>

<style scoped>
.p-list-item {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 0 8px;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    transition: transform 80ms ease-out, background-color 150ms;
}

.p-list-item:hover:not(.p-list-item--disabled) {
    background-color: #eff6ff;
}

.p-list-item--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-list-item__indicator {
    width: 2px;
    height: 24px;
    border-radius: 9999px;
    margin-right: 8px;
    transition: all 200ms;
}

.p-list-item__icon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    flex-shrink: 0;
    transition: color 150ms;
}

.p-list-item__content {
    flex: 1;
    min-width: 0;
}

.p-list-item__title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 150ms;
}

.p-list-item__title--checked {
    font-weight: 500;
}

.p-list-item__info {
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
