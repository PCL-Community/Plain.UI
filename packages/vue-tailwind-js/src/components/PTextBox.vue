<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
    /** 输入值 */
    Text: {
        type: String,
        default: undefined,
    },
    /** 提示文本 */
    HintText: {
        type: String,
        default: "",
    },
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
    ValidateResult: {
        type: String,
        default: "",
    },
    /** 自定义类名 */
    className: {
        type: String,
        default: "",
    },
    /** 占位符 */
    Placeholder: {
        type: String,
        default: "",
    },
    /** 输入类型 */
    Type: {
        type: String,
        default: "text",
        validator: (value) => ["text", "password", "number"].includes(value),
    },
});

const emit = defineEmits(["change", "pressEnter", "blur"]);

const internalValue = ref("");
const isFocused = ref(false);
const isHovered = ref(false);
const inputRef = ref(null);

const value = computed(() => (props.Text !== undefined ? props.Text : internalValue.value));
const isValidated = computed(() => !props.ValidateResult || props.ValidateResult === "");
const hasError = computed(() => !isValidated.value && props.ShowValidateResult && value.value !== "");

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
const getBorderColor = () => {
    if (props.IsEnabled) return "border-gray-400";
    if (hasError.value) return "border-red-400";
    if (isFocused.value) return "border-blue-500";
    if (isHovered.value) return "border-blue-400";
    return "border-blue-300";
};

// 背景颜色
const getBackgroundColor = () => {
    if (!props.HasBackground) return "bg-transparent";
    if (props.IsEnabled) return "bg-gray-100";
    if (hasError.value) return "bg-red-50";
    if (isFocused.value) return "bg-blue-50";
    if (isHovered.value) return "bg-blue-50";
    return "bg-white/50";
};

// 文本颜色
const getTextColor = () => {
    if (!props.IsEnabled) return "text-gray-400";
    if (hasError.value) return "text-red-500";
    return "text-gray-700";
};

const borderColorClass = computed(getBorderColor);
const backgroundColorClass = computed(getBackgroundColor);
const textColorClass = computed(getTextColor);
</script>

<template>
    <div :class="['flex flex-col gap-1', className]">
        <div
            :class="['relative flex items-center border transition-all duration-200', borderColorClass, backgroundColorClass]"
            :style="{ borderRadius: `${CornerRadius}px` }"
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
                :class="[
                    'w-full px-3 py-2 text-[13px] bg-transparent outline-none',
                    textColorClass,
                    'placeholder:text-gray-400',
                ]" />

            <!-- 提示文本 -->
            <span
                v-if="HintText && !value && !Placeholder"
                class="absolute left-3 text-[13px] text-gray-400 pointer-events-none">
                {{ HintText }}
            </span>
        </div>

        <!-- 验证错误信息 -->
        <div v-if="hasError && ShowValidateResult" class="text-[12px] text-red-500 animate-fadeIn">
            {{ ValidateResult }}
        </div>
    </div>
</template>
