import { app } from "../../scripts/app.js";

// 定义一个函数，用于创建和更新 HTML 内容
function createAndAppendHTMLWidget(node, app) {
    // 检查是否已经存在我们的 HTML widget，避免重复添加
    let htmlWidget = node.widgets.find(w => w.name === "html_display");

    if (!htmlWidget) {
        // 创建一个 div 元素来承载你的 HTML 内容
        const container = document.createElement("div");
        container.style.cssText = `
            padding: 10px;
            background-color: #333;
            border: 1px solid #555;
            border-radius: 5px;
            margin-top: 10px;
            color: #eee;
            font-family: sans-serif;
            overflow: auto;
            max-height: 200px; /* 限制高度，可以滚动 */
        `;

        // 添加一个 LiteGraph.js DOM widget
        // name: widget 的内部名称
        // type: "dom_element" 是一个常见的类型，表示是一个 DOM 元素
        // element: 你要插入的 DOM 元素
        // options: 其他选项，如是否在缩放时隐藏
        htmlWidget = node.addDOMWidget("html_display", "dom_element", container, {
            hideOnZoom: false, // 不在缩放时隐藏
            // 每次节点渲染时，都会调用这里的 onDraw 回调函数
            onDraw: function(ctx, app) {
                // 获取 Python 节点传递过来的内容
                // 这里的 node.properties 或者 node.inputs 中可能包含你需要的数据
                // 对于本例，我们从节点内部获取文本内容
                const textInput = node.widgets.find(w => w.name === "text_content");
                if (textInput && textInput.value) {
                    container.innerHTML = textInput.value;
                }
                // 确保 widget 的大小根据内容调整
                node.setDirtyCanvas(true, true);
            }
        });

        // 调整 widget 的大小，使其与节点内容对齐
        htmlWidget.doDraw = function(ctx, node, widget_width, y, widget_height) {
            // 这个函数在这里可能不需要特别实现，因为我们使用的是 DOM 元素
            // 它的渲染由浏览器处理。
            // 但如果你需要更精细的控制，可以覆写它。
            return true; // 返回 true 表示 widget 已经绘制完成
        };

        // 确保当输入值改变时更新显示
        const originalComputeSize = htmlWidget.computeSize;
        htmlWidget.computeSize = function() {
            // 重新计算 widget 大小以适应内容
            const width = container.scrollWidth + 20; // 20px for padding
            const height = container.scrollHeight + 20;
            return [width, height];
        };

    }
    // 每次节点更新时，确保 HTML 内容是最新
    const textInput = node.widgets.find(w => w.name === "text_content");
    if (textInput && textInput.value) {
        htmlWidget.element.innerHTML = textInput.value;
    }
    node.setDirtyCanvas(true, true);
}


app.registerExtension({
    name: "MyHTMLNode.HTMLRenderer",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // 检查是否是我们的自定义节点
        if (nodeData.name === "MyHTMLNode") {
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function () {
                onConfigure?.apply(this, arguments);
                createAndAppendHTMLWidget(this, app);
            };

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);
                createAndAppendHTMLWidget(this, app);
            };

            // 如果节点已经存在于图中，也需要处理
            if (nodeType.instanciated) {
                createAndAppendHTMLWidget(nodeType.instanciated, app);
            }
        }
    }
});