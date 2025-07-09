class MyHTMLNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text_content": ("STRING", {"multiline": True}),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID"  # 这是一个 trick，用于在前端识别特定的节点实例
            }
        }

    RETURN_TYPES = ("STRING",)
    OUTPUT_NODE = True
    RETURN_NAMES = ("html_output",)
    FUNCTION = "generate_html"
    CATEGORY = "My Custom Nodes"

    def generate_html(self, text_content, unique_id):
        # 在这里，你可以处理 text_content，或者生成更复杂的 HTML
        # 实际的 HTML 渲染发生在前端，这里只是将内容传递出去
        return (text_content,)

# 注册节点
NODE_CLASS_MAPPINGS = {
    "MyHTMLNode": MyHTMLNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MyHTMLNode": "HTML Content Renderer"
}

WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]