from PIL import Image, ImageDraw, ImageFont
import io
import base64


def add_comic_text(base64_image,texts):
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data)).convert("RGBA")
    draw = ImageDraw.Draw(image)

    font_path = "comic_text.ttf"
    font_size = 30
    font = ImageFont.truetype(font_path, font_size)

    padding = 20
    box_color = (255, 255, 255, 128)

    def calculate_box_size(text, font, padding):
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        return (text_width + 2 * padding, text_height + 2 * padding)

    box_sizes = [calculate_box_size(text, font, padding) for text in texts]

    top_left_position = (50, 50)
    bottom_right_position = (
        image.width - box_sizes[1][0] - 50,
        image.height - box_sizes[1][1] - 50
    )

    for i, (text, box_size) in enumerate(zip(texts, box_sizes)):
        if i == 0:
            position = top_left_position
        else:
            position = bottom_right_position
        
        x, y = position
        width, height = box_size
        box_coords = (x, y, x + width, y + height)
        
        draw.rounded_rectangle(box_coords, fill=box_color, outline="black", radius=20)
        
        text_x = x + padding
        text_y = y + padding
        
        draw.text((text_x, text_y), text, font=font, fill="black")

    output_buffer = io.BytesIO()
    image.save(output_buffer, format="PNG")
    output_buffer.seek(0)
    output_path = "output_image_with_dynamic_boxes.png"
    image.save(output_path)
    output_base64 = base64.b64encode(output_buffer.getvalue()).decode("utf-8")
    return output_base64