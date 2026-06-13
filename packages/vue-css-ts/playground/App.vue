<script setup lang="ts">
import { ref } from "vue";
import {
    PButton,
    PCheckBox,
    PTextBox,
    PSlider,
    PRadioButton,
    PIconButton,
    PCard,
    PComboBox,
    PExtraButton,
    PExtraTextButton,
    PHint,
    PIconTextButton,
    PListItem,
    PLoading,
    PSearchBox,
    type PButtonColorState,
    type PHintTheme,
    type PLoadingState,
} from "../src";

// 常用图标 SVG paths
const ICONS = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    settings:
        "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    folder: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    upload: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5v-2z",
};

// 下拉框选项
const COMBO_OPTIONS = [
    { Value: "option1", Label: "选项一" },
    { Value: "option2", Label: "选项二" },
    { Value: "option3", Label: "选项三" },
    { Value: "option4", Label: "选项四" },
];

// 响应式状态
const buttonColorType = ref<PButtonColorState>("Normal");
const checkBoxChecked = ref<boolean | null>(false);
const checkBoxText = ref("启用功能");
const textBoxValue = ref("");
const sliderValue = ref(50);
const selectedRadio = ref("option1");
const cardSwapped = ref(false);
const comboValue = ref("");
const extraButtonProgress = ref(65);
const loadingStatus = ref<PLoadingState>("loading");
const searchValue = ref("");
const hintType = ref<PHintTheme>("Blue");
</script>

<template>
    <div class="playground">
        <h1>Plain UI - Vue + CSS + TypeScript</h1>

        <!-- PButton Section -->
        <section>
            <h2>PButton 按钮</h2>
            <div class="demo-row">
                <PButton Text="普通按钮" />
                <PButton Text="高亮按钮" ColorState="Highlight" />
                <PButton Text="危险按钮" ColorState="Red" />
                <PButton Text="禁用按钮" :IsEnabled="false" />
            </div>
            <div class="demo-row">
                <PButton Text="自定义内边距" Padding="12px 24px" />
                <PButton ColorState="Highlight">子元素内容</PButton>
            </div>
        </section>

        <!-- PCheckBox Section -->
        <section>
            <h2>PCheckBox 复选框</h2>
            <div class="demo-row">
                <PCheckBox
                    :Text="checkBoxText"
                    :Checked="checkBoxChecked"
                    @change="(checked) => (checkBoxChecked = checked)"
                />
                <PCheckBox Text="禁用状态" :IsEnabled="false" />
                <PCheckBox Text="已选中禁用" :Checked="true" :IsEnabled="false" />
            </div>
            <div class="demo-row">
                <PCheckBox
                    Text="三态复选框"
                    :IsThreeState="true"
                    :Checked="checkBoxChecked"
                    @change="(checked) => (checkBoxChecked = checked)"
                />
                <PTextBox
                    Placeholder="输入复选框文本"
                    :Text="checkBoxText"
                    @change="(val) => (checkBoxText = val)"
                    style="width: 200px"
                />
            </div>
        </section>

        <!-- PTextBox Section -->
        <section>
            <h2>PTextBox 输入框</h2>
            <div class="demo-col" style="max-width: 500px">
                <PTextBox
                    Placeholder="请输入内容..."
                    :Text="textBoxValue"
                    @change="(val) => (textBoxValue = val)"
                    @press-enter="() => alert(`输入内容: ${textBoxValue}`)"
                />
                <PTextBox Placeholder="带提示文本" HintText="这是提示文本" />
                <PTextBox Text="禁用状态" :IsEnabled="false" />
                <PTextBox
                    Placeholder="验证失败示例"
                    Text="错误内容"
                    ValidateResult="输入格式不正确"
                    :ShowValidateResult="true"
                />
                <PTextBox Placeholder="密码输入" Type="password" />
                <PTextBox Text="无背景样式" :HasBackground="false" />
            </div>
        </section>

        <!-- PSlider Section -->
        <section>
            <h2>PSlider 滑块</h2>
            <div class="demo-col" style="max-width: 500px">
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        基础滑块: {{ sliderValue }}
                    </label>
                    <PSlider :Value="sliderValue" @change="(val) => (sliderValue = val)" :Min="0" :Max="100" />
                </div>
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        带格式化提示
                    </label>
                    <PSlider
                        :Value="sliderValue"
                        @change="(val) => (sliderValue = val)"
                        :Min="0"
                        :Max="100"
                        :GetHintText="(v: number) => `${v}%`"
                    />
                </div>
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        步长 10
                    </label>
                    <PSlider :Value="sliderValue" @change="(val) => (sliderValue = val)" :Min="0" :Max="100" :Step="10" />
                </div>
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        禁用状态
                    </label>
                    <PSlider :Value="50" :IsEnabled="false" />
                </div>
            </div>
        </section>

        <!-- PRadioButton Section -->
        <section>
            <h2>PRadioButton 单选按钮</h2>
            <div class="demo-row">
                <PRadioButton
                    Text="选项一"
                    :Checked="selectedRadio === 'option1'"
                    @change="() => (selectedRadio = 'option1')"
                />
                <PRadioButton
                    Text="选项二"
                    :Checked="selectedRadio === 'option2'"
                    @change="() => (selectedRadio = 'option2')"
                />
                <PRadioButton
                    Text="选项三"
                    :Checked="selectedRadio === 'option3'"
                    @change="() => (selectedRadio = 'option3')"
                />
                <PRadioButton Text="禁用选项" :IsEnabled="false" />
            </div>
            <div class="demo-row">
                <PRadioButton
                    Text="带图标"
                    :Logo="ICONS.home"
                    :Checked="selectedRadio === 'icon1'"
                    @change="() => (selectedRadio = 'icon1')"
                />
                <PRadioButton
                    Text="设置"
                    :Logo="ICONS.settings"
                    :Checked="selectedRadio === 'icon2'"
                    @change="() => (selectedRadio = 'icon2')"
                />
            </div>
        </section>

        <!-- PIconButton Section -->
        <section>
            <h2>PIconButton 图标按钮</h2>
            <div class="demo-row">
                <PIconButton :Logo="ICONS.home" @click="() => alert('点击了首页')" />
                <PIconButton :Logo="ICONS.settings" @click="() => alert('点击了设置')" />
                <PIconButton :Logo="ICONS.search" @click="() => alert('点击了搜索')" />
                <PIconButton :Logo="ICONS.add" @click="() => alert('点击了添加')" />
                <PIconButton :Logo="ICONS.delete" @click="() => alert('点击了删除')" />
                <PIconButton :Logo="ICONS.edit" @click="() => alert('点击了编辑')" />
            </div>
            <div class="demo-row">
                <PIconButton :Logo="ICONS.home" :LogoScale="20" ToolTip="大尺寸" />
                <PIconButton :Logo="ICONS.home" :LogoScale="12" ToolTip="小尺寸" />
                <PIconButton :Logo="ICONS.home" :IsEnabled="false" ToolTip="禁用" />
            </div>
        </section>

        <!-- PCard Section -->
        <section>
            <h2>PCard 卡片</h2>
            <div class="demo-col" style="max-width: 500px">
                <PCard Title="普通卡片">
                    <p style="font-size: 13px; color: #666">这是卡片的内容区域，可以放置任何内容。</p>
                </PCard>

                <PCard Title="可折叠卡片" :CanSwap="true" :IsSwapped="cardSwapped" @swap="(val) => (cardSwapped = val)">
                    <div>
                        <p style="font-size: 13px; color: #666; margin-bottom: 10px">点击标题栏可以折叠/展开卡片。</p>
                        <PButton Text="卡片内的按钮" />
                    </div>
                </PCard>

                <PCard Title="禁用动画的卡片" :HasMouseAnimation="false">
                    <p style="font-size: 13px; color: #666">这个卡片禁用了鼠标悬停动画效果。</p>
                </PCard>
            </div>
        </section>

        <!-- PComboBox Section -->
        <section>
            <h2>PComboBox 下拉框</h2>
            <div class="demo-col" style="max-width: 500px">
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        基础下拉框
                    </label>
                    <PComboBox
                        :Items="COMBO_OPTIONS"
                        :Text="comboValue"
                        @change="(val) => (comboValue = val)"
                        HintText="请选择一个选项"
                    />
                </div>
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        可编辑下拉框
                    </label>
                    <PComboBox :Items="COMBO_OPTIONS" :IsEditable="true" HintText="输入或选择" />
                </div>
                <div>
                    <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block">
                        禁用状态
                    </label>
                    <PComboBox :Items="COMBO_OPTIONS" HintText="禁用状态" :IsEnabled="false" />
                </div>
            </div>
        </section>

        <!-- PExtraButton Section -->
        <section>
            <h2>PExtraButton 扩展按钮</h2>
            <div class="demo-row">
                <PExtraButton :Logo="ICONS.add" ToolTip="添加" @click="() => alert('点击了扩展按钮')" />
                <PExtraButton :Logo="ICONS.download" ToolTip="下载" :ShowProgress="true" :Progress="extraButtonProgress" />
                <PExtraButton :Logo="ICONS.close" ToolTip="关闭" :IsEnabled="false" />
            </div>
            <div class="demo-row">
                <PSlider
                    :Value="extraButtonProgress"
                    @change="(val) => (extraButtonProgress = val)"
                    :Min="0"
                    :Max="100"
                    style="width: 200px"
                />
                <span style="font-size: 14px; color: #666">进度: {{ extraButtonProgress }}%</span>
            </div>
        </section>

        <!-- PExtraTextButton Section -->
        <section>
            <h2>PExtraTextButton 扩展文本按钮</h2>
            <div class="demo-row">
                <PExtraTextButton Text="添加项目" :Logo="ICONS.add" @click="() => alert('点击了扩展文本按钮')" />
                <PExtraTextButton Text="上传文件" :Logo="ICONS.upload" />
                <PExtraTextButton Text="下载" :Logo="ICONS.download" />
                <PExtraTextButton Text="禁用状态" :Logo="ICONS.close" :IsEnabled="false" />
            </div>
        </section>

        <!-- PHint Section -->
        <section>
            <h2>PHint 提示</h2>
            <div class="demo-col" style="max-width: 500px">
                <PHint Theme="Blue" Text="这是一条信息提示" />
                <PHint Theme="Blue" Text="操作成功完成！" />
                <PHint Theme="Yellow" Text="请注意，这是一个警告" />
                <PHint Theme="Red" Text="发生错误，请重试" />
                <PHint Theme="Blue" Text="这是可关闭的提示" :CanClose="true" />
            </div>
        </section>

        <!-- PIconTextButton Section -->
        <section>
            <h2>PIconTextButton 图标文本按钮</h2>
            <div class="demo-row" style="background: #4A90E2; padding: 16px; border-radius: 8px">
                <PIconTextButton Text="首页" :Logo="ICONS.home" />
                <PIconTextButton Text="设置" :Logo="ICONS.settings" />
                <PIconTextButton Text="收藏" :Logo="ICONS.star" />
                <PIconTextButton Text="禁用" :Logo="ICONS.close" :IsEnabled="false" />
            </div>
        </section>

        <!-- PListItem Section -->
        <section>
            <h2>PListItem 列表项</h2>
            <div class="demo-col" style="max-width: 500px">
                <PListItem
                    Title="列表项一"
                    Info="副标题信息"
                    :Logo="ICONS.folder"
                    :Checked="selectedRadio === 'list1'"
                    @click="() => (selectedRadio = 'list1')"
                />
                <PListItem
                    Title="列表项二"
                    :Logo="ICONS.star"
                    :Checked="selectedRadio === 'list2'"
                    @click="() => (selectedRadio = 'list2')"
                />
                <PListItem
                    Title="列表项三"
                    Info="带副标题"
                    :Checked="selectedRadio === 'list3'"
                    @click="() => (selectedRadio = 'list3')"
                />
                <PListItem Title="禁用项" :IsEnabled="false" />
            </div>
        </section>

        <!-- PLoading Section -->
        <section>
            <h2>PLoading 加载</h2>
            <div class="demo-row">
                <div style="text-align: center">
                    <PLoading Text="加载中..." State="loading" />
                </div>
                <div style="text-align: center">
                    <PLoading Text="成功" State="success" />
                </div>
                <div style="text-align: center">
                    <PLoading Text="失败" State="error" />
                </div>
                <div style="text-align: center">
                    <PLoading Text="自定义颜色" State="loading" Foreground="#10B981" />
                </div>
            </div>
        </section>

        <!-- PSearchBox Section -->
        <section>
            <h2>PSearchBox 搜索框</h2>
            <div class="demo-col" style="max-width: 500px">
                <PSearchBox
                    Hint="搜索..."
                    :Text="searchValue"
                    @change="(val) => (searchValue = val)"
                    @search="(v) => alert(`搜索: ${v}`)"
                    @clear="() => alert('已清除')"
                />
                <PSearchBox Hint="带搜索按钮..." :SearchButtonVisibility="true" @search="(v) => alert(`搜索: ${v}`)" />
                <PSearchBox Hint="禁用状态" :IsEnabled="false" />
            </div>
        </section>

        <!-- 组合使用示例 -->
        <section>
            <h2>组合使用示例</h2>
            <PCard Title="搜索卡片">
                <div class="demo-col">
                    <PSearchBox Hint="搜索内容..." :SearchButtonVisibility="true" />
                    <div class="demo-row">
                        <PCheckBox Text="记住搜索条件" />
                        <PButton Text="高级搜索" ColorState="Highlight" />
                    </div>
                </div>
            </PCard>
        </section>
    </div>
</template>

<style>
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
    min-height: 100vh;
}

.playground {
    padding: 40px;
    max-width: 1000px;
    margin: 0 auto;
}

h1 {
    color: #4A90E2;
    margin-bottom: 32px;
    font-size: 28px;
}

h2 {
    color: #4A90E2;
    margin: 24px 0 16px;
    font-size: 20px;
}

section {
    margin-bottom: 48px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
    border: 1px solid rgba(74, 144, 226, 0.2);
}

.demo-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
}

.demo-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
