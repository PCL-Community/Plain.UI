<script setup lang="ts">
import { ref, computed } from "vue";

export interface PSearchBoxProps {
    /** 搜索值 */
    Text?: string;
    /** 占位符 */
    Hint?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 搜索按钮可见性 */
    SearchButtonVisibility?: boolean;
    /** 值变更事件 */
    onChange?: (value: string) => void;
    /** 搜索事件 */
    onSearch?: (value: string) => void;
    /** 清除事件 */
    onClear?: () => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PSearchBoxProps>(), {
    Text: undefined,
    Hint: "搜索...",
    IsEnabled: true,
    SearchButtonVisibility: false,
    className: "",
});

const emit = defineEmits<{
    change: [value: string];
    search: [value: string];
    clear: [];
}>();

const disabled = computed(() => !props.IsEnabled);
const internalValue = ref("");
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const value = computed(() => props.Text !== undefined ? props.Text : internalValue.value);
const hasValue = computed(() => value.value && value.value.length > 0);

const handleChange = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    if (props.Text === undefined) {
        internalValue.value = newValue;
    }
    props.onChange?.(newValue);
    emit("change", newValue);
};

const handleClear = () => {
    if (props.Text === undefined) {
        internalValue.value = "";
    }
    props.onChange?.("");
    emit("change", "");
    props.onClear?.();
    emit("clear");
    inputRef.value?.focus();
};

const handleSearch = () => {
    props.onSearch?.(value.value);
    emit("search", value.value);
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        handleSearch();
    }
};

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};

// 边框颜色
const borderColor = computed(() => {
    if (disabled.value) return "#d1d5db"; // gray-300
    if (isFocused.value) return "#60a5fa"; // blue-400
    return "#bfdbfe"; // blue-200
});

// 背景颜色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f9fafb"; // gray-50
    return "rgba(255, 255, 255, 0.5)";
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    return "#60a5fa"; // blue-400
});

// 阴影
const boxShadow = computed(() => {
    if (isFocused.value && !disabled.value) {
        return "0 4px 20px rgba(0, 0, 0, 0.1)";
    }
    return "0 4px 20px rgba(0, 0, 0, 0.05)";
});
</script>

<template>
    <div
        class="p-search-box"
        :class="[className, { disabled, focused: isFocused }]"
        :style="{
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            boxShadow: boxShadow,
        }">
        <!-- 搜索图标 -->
        <svg
            class="p-search-box-icon"
            :style="{ color: iconColor }"
            viewBox="0 0 1024 1024"
            fill="currentColor">
            <path d="M675.9168 242.816C556.3008 123.2 362.4448 123.2 242.8288 242.816 123.2128 362.432 123.2128 556.288 242.8288 675.904 362.4448 795.52 556.3008 795.52 675.9168 675.904 795.5328 556.288 795.5328 362.432 675.9168 242.816L675.9168 242.816ZM1000.7168 892.48C1030.6048 922.368 1030.6048 970.816 1000.7168 1000.704 970.8288 1030.656 922.3808 1030.656 892.4288 1000.704L730.0608 838.336C728.1408 836.416 727.4368 833.92 725.7728 831.872 546.3168 960.448 295.7568 945.408 134.5408 784.192-44.8512 604.8-44.8512 313.92 134.5408 134.528 313.9328-44.864 604.8128-44.864 784.2048 134.528 945.4208 295.744 960.4608 546.304 831.8848 725.76 833.9328 727.424 836.4288 728.128 838.3488 730.048L1000.7168 892.48Z" />
        </svg>

        <!-- 输入框 -->
        <input
            ref="inputRef"
            type="text"
            :value="value"
            @input="handleChange"
            @keydown="handleKeyDown"
            @focus="handleFocus"
            @blur="handleBlur"
            :placeholder="Hint"
            :disabled="disabled"
            class="p-search-box-input"
            :class="{ disabled }"
        />

        <!-- 清除按钮 -->
        <button
            v-if="hasValue && !disabled"
            type="button"
            class="p-search-box-clear"
            :class="{ 'has-search-btn': SearchButtonVisibility }"
            @click="handleClear"
            title="清除">
            <svg class="p-search-box-clear-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
        </button>

        <!-- 搜索按钮 -->
        <button
            v-if="SearchButtonVisibility"
            type="button"
            class="p-search-box-btn"
            :class="{ disabled }"
            :disabled="disabled"
            @click="handleSearch">
            搜索
        </button>
    </div>
</template>

<style scoped>
.p-search-box {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 5px;
    border: 1px solid;
    backdrop-filter: blur(4px);
    transition: all 200ms;
}

.p-search-box.focused {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.p-search-box.disabled {
    cursor: not-allowed;
}

.p-search-box-icon {
    position: absolute;
    left: 14px;
    width: 16px;
    height: 16px;
    pointer-events: none;
    z-index: 10;
}

.p-search-box-input {
    flex: 1;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    padding-left: 40px;
    padding-right: 12px;
    color: #374151;
}

.p-search-box-input::placeholder {
    color: #9ca3af;
}

.p-search-box-input.disabled {
    color: #9ca3af;
    cursor: not-allowed;
}

.p-search-box-clear {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #60a5fa;
    transition: all 150ms;
    right: 8px;
}

.p-search-box-clear.has-search-btn {
    right: 70px;
}

.p-search-box-clear:hover {
    color: #3b82f6;
    background-color: #eff6ff;
}

.p-search-box-clear-icon {
    width: 14px;
    height: 14px;
}

.p-search-box-btn {
    height: 32px;
    padding: 0 16px;
    margin-right: 4px;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 500;
    background-color: #60a5fa;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 150ms;
}

.p-search-box-btn:hover:not(:disabled) {
    background-color: #3b82f6;
}

.p-search-box-btn:active:not(:disabled) {
    transform: scale(0.95);
}

.p-search-box-btn.disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
}
</style>
