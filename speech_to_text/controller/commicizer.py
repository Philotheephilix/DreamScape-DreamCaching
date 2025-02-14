from PIL import Image, ImageDraw, ImageFont
import io
import base64

def add_comic_text(base64_image, text):
    # Decode the base64 image
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data)).convert("RGBA")
    draw = ImageDraw.Draw(image)

    # Load the comic font
    font_path = "fonts/comic_text.ttf"
    font_size = 30
    font = ImageFont.truetype(font_path, font_size)

    # Define padding and box color
    padding = 20
    box_color = (255, 255, 255, 128)  # Semi-transparent white

    # Function to calculate the size of the text box
    def calculate_box_size(text, font, padding):
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        return (text_width + 2 * padding, text_height + 2 * padding)

    # Add a newline after every five words
    words = text.split()
    formatted_text = ""
    for i, word in enumerate(words):
        formatted_text += word + " "
        if (i + 1) % 5 == 0:
            formatted_text += "\n"

    # Calculate the box size for the formatted text
    box_size = calculate_box_size(formatted_text, font, padding)

    # Define the position for the text box (top-left corner)
    position = (50, 50)

    # Draw the rounded rectangle for the text box
    x, y = position
    width, height = box_size
    box_coords = (x, y, x + width, y + height)
    draw.rounded_rectangle(box_coords, fill=box_color, outline="black", radius=20)

    # Draw the text inside the box
    text_x = x + padding
    text_y = y + padding
    draw.text((text_x, text_y), formatted_text, font=font, fill="black")

    # Save the modified image to a buffer
    output_buffer = io.BytesIO()
    image.save(output_buffer, format="PNG")
    output_buffer.seek(0)

    # Encode the image to base64 and return it
    output_base64 = base64.b64encode(output_buffer.getvalue()).decode("utf-8")
    return output_base64