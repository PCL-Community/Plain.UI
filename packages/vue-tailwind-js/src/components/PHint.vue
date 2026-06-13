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
    className: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["close"]);

const isVisible = ref(true);

const themeConfig = {
    Red: {
        borderColor: "border-l-red-400",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        iconColor: "text-red-400",
    },
    Yellow: {
        borderColor: "border-l-yellow-400",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        iconColor: "text-yellow-500",
    },
    Blue: {
        borderColor: "border-l-blue-400",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        iconColor: "text-blue-400",
    },
};

const config = computed(() => themeConfig[props.Theme]);

const handleClose = () => {
    isVisible.value = false;
    emit("close");
};
</script>

<template>
    <div
        v-if="isVisible"
        :class="[
            'flex items-center justify-between',
            'border-l-[3px] rounded-r-xs',
            config.borderColor,
            config.bgColor,
            className,
        ]">
        <span
            :class="['flex-1 py-2.5 px-3 text-[13px] leading-4', config.textColor]"
            style="line-height: 16px; margin-bottom: -1px">
            {{ Text }}
        </span>

        <button
            v-if="CanClose"
            type="button"
            @click="handleClose"
            :class="[
                'p-2 mr-2 rounded-full transition-colors duration-150',
                'hover:bg-black/5',
                config.iconColor,
            ]"
            title="不再显示">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2,0 L0,2 8,10 0,18 2,20 10,12 18,20 20,18 12,10 20,2 18,0 10,8 2,0Z" />
            </svg>
        </button>
    </div>
</template>
