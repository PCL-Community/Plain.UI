<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
    /** 选项列表 */
    Items: {
        type: Array,
        required: true,
    },
    /** 当前选中值 */
    Text: {
        type: String,
        default: undefined,
    },
    /** 提示文本 */
    HintText: {
        type: String,
        default: "",
    },
    /** 是否可编辑 */
    IsEditable: {
        type: Boolean,
        default: false,
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

const emit = defineEmits(["change", "textChange"]);

const disabled = computed(() => !props.IsEnabled);
const internalValue = ref("");
const isOpen = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const isPressed = ref(false);
const containerRef = ref(null);
const inputRef = ref(null);

const value = computed(() => (props.Text !== undefined ? props.Text : internalValue.value));
const selectedOption = computed(() => props.Items.find((opt) => opt.Value === value.value));
const displayText = computed(() => selectedOption.value?.Label || (props.IsEditable ? value.value : ""));

const handleSelect = (option) => {
    if (props.Text === undefined) {
        internalValue.value = option.Value;
    }
    emit("change", option.Value);
    isOpen.value = false;
};

const handleInputChange = (e) => {
    const newText = e.target.value;
    if (props.Text === undefined) {
        internalValue.value = newText;
    }
    emit("textChange", newText);
    emit("change", newText);
};

const handleToggle = () => {
    if (!disabled.value) {
        isOpen.value = !isOpen.value;
    }
};

// 点击外部关闭下拉
const handleClickOutside = (e) => {
    if (containerRef.value && !containerRef.value.contains(e.target)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});

// 颜色状态
const getBorderColor = () => {
    if (disabled.value) return "border-gray-400";
    if (isOpen.value || isPressed.value) return "border-blue-500";
    if (isHovered.value) return "border-blue-400";
    return "border-blue-300";
};

const getBackgroundColor = () => {
    if (disabled.value) return "bg-gray-100";
    if (isOpen.value || isPressed.value) return "bg-blue-50";
    if (isHovered.value) return "bg-blue-50";
    return "bg-white/50";
};

const getTextColor = () => {
    if (disabled.value) return "text-gray-400";
    return "text-gray-700";
};

const borderColorClass = computed(getBorderColor);
const backgroundColorClass = computed(getBackgroundColor);
const textColorClass = computed(getTextColor);
</script>

<template>
    <div ref="containerRef" :class="['relative', className]">
        <!-- 输入框/触发器 -->
        <div
            :class="[
                'flex items-center border rounded-[3px] transition-all duration-200',
                borderColorClass,
                backgroundColorClass,
            ]">
            <input
                v-if="IsEditable"
                ref="inputRef"
                type="text"
                :value="displayText"
                @input="handleInputChange"
                :placeholder="HintText"
                :disabled="disabled"
                :class="[
                    'flex-1 px-3 py-2 text-[13px] bg-transparent outline-none',
                    textColorClass,
                    'placeholder:text-gray-400',
                ]"
                @focus="isFocused = true"
                @blur="isFocused = false" />
            <div
                v-else
                :class="['flex-1 px-3 py-2 text-[13px] cursor-pointer select-none', textColorClass]"
                @click="handleToggle">
                {{ displayText || HintText || "请选择..." }}
            </div>

            <!-- 下拉箭头 -->
            <button
                type="button"
                :disabled="disabled"
                :class="[
                    'px-3 py-2 transition-colors duration-200',
                    disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-400 hover:text-blue-500',
                ]"
                @click="handleToggle"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
                @mousedown="isPressed = true"
                @mouseup="isPressed = false">
                <svg
                    :class="['w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180']"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>
        </div>

        <!-- 下拉选项列表 -->
        <div
            v-if="isOpen"
            :class="[
                'absolute z-50 w-full mt-1 py-1',
                'bg-white border border-blue-300 rounded-[3px] shadow-lg',
                'max-h-60 overflow-auto',
            ]">
            <div
                v-for="option in Items"
                :key="option.Value"
                :class="[
                    'px-3 py-2 text-[13px] cursor-pointer transition-colors duration-150',
                    option.Value === value
                        ? 'bg-blue-100 text-blue-500'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-400',
                ]"
                @click="handleSelect(option)">
                {{ option.Label }}
            </div>
            <div v-if="Items.length === 0" class="px-3 py-2 text-[13px] text-gray-400">无选项</div>
        </div>
    </div>
</template>
