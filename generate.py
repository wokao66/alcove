import os
import json
import random

# 配置
IMAGE_DIR = 'images'
OUTPUT_FILE = 'data.json'

# 板块定义 (文件夹名 -> 显示名)
CATEGORIES = {
    'pure': '清纯',
    'sexy': '性感',
    'inner': '内搭',
    'maternity': '孕期'
}

def generate_data():
    gallery_data = []
    
    for folder_name, display_name in CATEGORIES.items():
        folder_path = os.path.join(IMAGE_DIR, folder_name)
        if not os.path.exists(folder_path):
            print(f"Skipping missing folder: {folder_path}")
            continue
            
        files = os.listdir(folder_path)
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                gallery_data.append({
                    'src': f"{IMAGE_DIR}/{folder_name}/{file}",
                    'category': folder_name,
                    'category_name': display_name
                })

    # 写入 JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, ensure_ascii=False, indent=2)
    
    print(f"Done! {len(gallery_data)} images processed. Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_data()