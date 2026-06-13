<script setup lang="ts">
import { ref, computed } from "vue";

export type PHintTheme = "Blue" | "Red" | "Yellow";

export interface PHintProps {
    /** 提示文本 */
    Text: string;
    /** 提示主题 */
    Theme?: PHintTheme;
    /** 是否可关闭 */
    CanClose?: boolean;
    /** 关闭事件 */
    onClose?: () => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PHintProps>(), {
    Text: "",
    Theme: "Blue",
    CanClose: false,
    className: "",
});

const emit = defineEmits<{
    close: [];
}>();

const isVisible = ref(true);

const handleClose = () => {
    isVisible.value = false;
    props.onClose?.();
    emit("close");
};

const themeConfig = {
    Red: {
        borderColor: "#f87171", // red-400
        bgColor: "#fef2f2", // red-50
        textColor: "#dc2626", // red-600
        iconColor: "#f87171", // red-400
    },
    Yellow: {
        borderColor: "#facc15", // yellow-400
        bgColor: "#fefce8", // yellow-50
        textColor: "#a16207", // yellow-700
        iconColor: "#eab308", // yellow-500
    },
    Blue: {
        borderColor: "#60a5fa", // blue-400
        bgColor: "#eff6ff", // blue-50
        textColor: "#2563eb", // blue-600
        iconColor: "#60a5fa", // blue-400
    },
};

const config = computed(() => themeConfig[props.Theme]);
</script>

<template>
    <div
        v-if="isVisible"
        class="p-hint"
        :class="className"
        :style="{
            borderLeftColor: config.borderColor,
            backgroundColor: config.bgColor,
        }">
        <span
            class="p-hint-text"
            :style="{ color: config.textColor }">
            {{ Text }}
        </span>

        <button
            v-if="CanClose"
            type="button"
            class="p-hint-close"
            :style="{ color: config.iconColor }"
            @click="handleClose"
            title="不再显示">
            <svg class="p-hint-close-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2,0 L0,2 8,10 0,18 2,20 10,12 18,20 20,18 12,10 20,2 18,0 10,8 2,0Z" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.p-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left-width: 3px;
    border-left-style: solid;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.p-hint-text {
    flex: 1;
    padding: 10px 12px;
    font-size: 13px;
    line-height: 16px;
    margin-bottom: -1px;
}

.p-hint-close {
    padding: 8px;
    margin-right: 8px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 150ms;
}

.p-hint-close:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.p-hint-close-icon {
    width: 16px;
    height: 16px;
}
</style>
