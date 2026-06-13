<script setup lang="ts">
import { ref, computed } from "vue";

export interface PListItemProps {
    /** 标题 */
    Title: string;
    /** 信息/副标题 */
    Info?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否选中 */
    Checked?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: () => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PListItemProps>(), {
    Info: "",
    Logo: "",
    Checked: false,
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    click: [];
}>();

const disabled = computed(() => !props.IsEnabled);
const isHovered = ref(false);
const isPressed = ref(false);

const handleClick = () => {
    if (!disabled.value) {
        props.onClick?.();
        emit("click");
    }
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
const indicatorColor = computed(() => {
    return props.Checked ? "#60a5fa" : "transparent"; // blue-400
});

// 图标颜色
const iconColor = computed(() => {
    if (props.Checked) return "#60a5fa"; // blue-400
    if (isHovered.value && !disabled.value && !props.Checked) return "#93c5fd"; // blue-300
    return "#9ca3af"; // gray-400
});

// 标题颜色
const titleColor = computed(() => {
    if (props.Checked) return "#3b82f6"; // blue-500
    if (isHovered.value && !disabled.value && !props.Checked) return "#60a5fa"; // blue-400
    return "#374151"; // gray-700
});
</script>

<template>
    <div
        class="p-list-item"
        :class="[className, { disabled, hovered: isHovered && !disabled }]"
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
            class="p-list-item-indicator"
            :style="{ backgroundColor: indicatorColor }"
        />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            class="p-list-item-icon"
            :style="{ color: iconColor }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 内容区域 -->
        <div class="p-list-item-content">
            <div
                class="p-list-item-title"
                :class="{ checked: Checked }"
                :style="{ color: titleColor }">
                {{ Title }}
            </div>
            <div v-if="Info" class="p-list-item-info">{{ Info }}</div>
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

.p-list-item.hovered {
    background-color: #eff6ff;
}

.p-list-item.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-list-item-indicator {
    width: 2px;
    height: 24px;
    border-radius: 9999px;
    margin-right: 8px;
    transition: all 200ms;
}

.p-list-item-icon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    flex-shrink: 0;
    transition: color 150ms;
}

.p-list-item-content {
    flex: 1;
    min-width: 0;
}

.p-list-item-title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 150ms;
}

.p-list-item-title.checked {
    font-weight: 500;
}

.p-list-item-info {
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
