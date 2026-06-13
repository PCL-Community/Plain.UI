<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
    /** 输入值 */
    Text: String,
    /** 提示文本 */
    HintText: String,
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: false,
    },
    /** 圆角 */
    CornerRadius: {
        type: Number,
        default: 3,
    },
    /** 是否有背景 */
    HasBackground: {
        type: Boolean,
        default: true,
    },
    /** 是否显示验证结果 */
    ShowValidateResult: {
        type: Boolean,
        default: true,
    },
    /** 验证错误信息 */
    ValidateResult: String,
    /** 自定义类名 */
    className: String,
    /** 占位符 */
    Placeholder: String,
    /** 输入类型 */
    Type: {
        type: String,
        default: "text",
    },
});

const emit = defineEmits(["change", "pressEnter", "blur"]);

const internalValue = ref("");
const isFocused = ref(false);
const isHovered = ref(false);
const inputRef = ref(null);

const value = computed(() =>
    props.Text !== undefined ? props.Text : internalValue.value
);

const isValidated = computed(
    () => !props.ValidateResult || props.ValidateResult === ""
);

const hasError = computed(
    () => !isValidated.value && props.ShowValidateResult && value.value !== ""
);

const handleChange = (e) => {
    const newValue = e.target.value;
    if (props.Text === undefined) {
        internalValue.value = newValue;
    }
    emit("change", newValue);
};

const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        emit("pressEnter");
    }
};

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
    emit("blur");
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
};

// 边框颜色
const borderColor = computed(() => {
    if (props.IsEnabled) return "#9ca3af";
    if (hasError.value) return "#f87171";
    if (isFocused.value) return "#3b82f6";
    if (isHovered.value) return "#60a5fa";
    return "#93c5fd";
});

// 背景颜色
const backgroundColor = computed(() => {
    if (!props.HasBackground) return "transparent";
    if (props.IsEnabled) return "#f3f4f6";
    if (hasError.value) return "#fef2f2";
    if (isFocused.value) return "#eff6ff";
    if (isHovered.value) return "#eff6ff";
    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (!props.IsEnabled) return "#9ca3af";
    if (hasError.value) return "#ef4444";
    return "#374151";
});
</script>

<template>
    <div class="p-textbox-wrapper" :class="className">
        <div
            class="p-textbox-container"
            :style="{
                borderRadius: `${CornerRadius}px`,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <input
                ref="inputRef"
                :type="Type"
                :value="value"
                @input="handleChange"
                @keydown="handleKeyDown"
                @focus="handleFocus"
                @blur="handleBlur"
                :disabled="!IsEnabled"
                :placeholder="Placeholder"
                class="p-textbox-input"
                :style="{ color: textColor }" />

            <!-- 提示文本 -->
            <span
                v-if="HintText && !value && !Placeholder"
                class="p-textbox-hint">
                {{ HintText }}
            </span>
        </div>

        <!-- 验证错误信息 -->
        <div v-if="hasError && ShowValidateResult" class="p-textbox-error">
            {{ ValidateResult }}
        </div>
    </div>
</template>

<style scoped>
.p-textbox-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.p-textbox-container {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid;
    transition: all 200ms;
}

.p-textbox-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
    background: transparent;
    border: none;
    outline: none;
}

.p-textbox-input::placeholder {
    color: #9ca3af;
}

.p-textbox-hint {
    position: absolute;
    left: 12px;
    font-size: 13px;
    color: #9ca3af;
    pointer-events: none;
}

.p-textbox-error {
    font-size: 12px;
    color: #ef4444;
    animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
