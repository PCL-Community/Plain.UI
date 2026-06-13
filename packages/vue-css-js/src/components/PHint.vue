<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 提示文本 */
    Text: {
        type: String,
        required: true,
    },
    /** 提示主题 */
    Theme: {
        type: String,
        default: "Blue",
        validator: (value) => ["Blue", "Red", "Yellow"].includes(value),
    },
    /** 是否可关闭 */
    CanClose: {
        type: Boolean,
        default: false,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["close"]);

const isVisible = ref(true);

const handleClose = () => {
    isVisible.value = false;
    emit("close");
};

const themeConfig = {
    Red: {
        borderColor: "#f87171",
        bgColor: "#fef2f2",
        textColor: "#dc2626",
        iconColor: "#f87171",
    },
    Yellow: {
        borderColor: "#facc15",
        bgColor: "#fefce8",
        textColor: "#a16207",
        iconColor: "#eab308",
    },
    Blue: {
        borderColor: "#60a5fa",
        bgColor: "#eff6ff",
        textColor: "#2563eb",
        iconColor: "#60a5fa",
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
            class="p-hint__text"
            :style="{
                color: config.textColor,
            }">
            {{ Text }}
        </span>

        <button
            v-if="CanClose"
            type="button"
            class="p-hint__close"
            :style="{ color: config.iconColor }"
            title="不再显示"
            @click="handleClose">
            <svg class="p-hint__close-icon" viewBox="0 0 20 20" fill="currentColor">
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

.p-hint__text {
    flex: 1;
    padding: 10px 12px;
    font-size: 13px;
    line-height: 16px;
    margin-bottom: -1px;
}

.p-hint__close {
    padding: 8px;
    margin-right: 8px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 150ms;
}

.p-hint__close:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.p-hint__close-icon {
    width: 16px;
    height: 16px;
}
</style>
