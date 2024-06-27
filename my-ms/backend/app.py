from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import openai
import os
from io import BytesIO
import base64
import pandas as pd
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
# At the top of your app.py file, after importing modules
print("Loading CSV file...")
try:
    df = pd.read_csv('./Dataset_Hamza.csv')
    print("CSV file loaded successfully")
    print("Columns in DataFrame:", df.columns.tolist())
except Exception as e:
    print(f"Error loading CSV file: {e}")


# Initialize OpenAI client with API key
openai.api_key = os.getenv('OPENAI_API_KEY')


@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    data = request.json
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')
    ethnicity = data.get('ethnicity')
    interests = data.get('interests')
    moral = data.get('moral')
    length = data.get('length')
    include_image = data.get('includeImage')

    prompt = f"Write a short story about a person named {name}, aged {age}, gender {gender}, ethnicity {ethnicity}, interested in {interests}. Include a moral: {moral}, if not empty. Target length: {length}, if not empty."
    
    try:
        # Generate story
        story_response = openai.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {"role": "system", "content": "You are a creative writer. Your task is to write engaging and imaginative stories."},
                {"role": "user", "content": prompt}
            ]
        )
        story = story_response.choices[0].message.content

        image_url = None
        if include_image:
            # Generate image
            image_prompt = f"A portrait of {name}, a {age}-year-old {gender} of {ethnicity} ethnicity, interested in {interests}."
            image_response = openai.images.generate(
                model="dall-e-3",
                prompt=image_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_url = image_response.data[0].url

        return jsonify({'story': story, 'image_url': image_url})
    except Exception as e:
        print(f"Error generating story or image: {e}")
        return jsonify({'error': 'Failed to generate story or image'}), 500

    
@app.route('/api/search-story', methods=['POST'])
def search_story():
    data = request.json
    filtered_df = df[
        (df['Name'] == data.get('name')) |
        (df['Age'] == data.get('age')) |
        (df['Gender'] == data.get('gender')) |
        (df['Interest'] == data.get('interests')) |
        (df['Ethnic Background'] == data.get('ethnicity'))
    ]
    if not filtered_df.empty:
        return jsonify({'story': filtered_df.iloc[0]['LLM-Generated Personalized Story']})
    else:
        return jsonify({'error': 'No matching story found'}), 404

@app.route('/api/save-story', methods=['POST'])
def save_story():
    data = request.json
    new_data = {
        'Name': data.get('name'),
        'Age': data.get('age'),
        'Gender': data.get('gender'),
        'Interest': data.get('interests'),
        'Ethnic Background': data.get('ethnicity'),
        'Moral': data.get('moral'),
        'LLM-Generated Personalized Story': data.get('story')
    }
    global df
    df = df._append(new_data, ignore_index=True)
    df.to_csv('./Dataset_Hamza.csv', index=False)
    return jsonify({'message': 'Story saved successfully'})


@app.route('/api/stories', methods=['GET'])
def get_stories():
    try:
        if 'LLM-Generated Personalized Story' not in df.columns:
            print("'LLM-Generated Personalized Story' column not found in DataFrame")
            return jsonify({'error': 'LLM-Generated Personalized Story column not found in dataset'}), 500
        
        stories = df['LLM-Generated Personalized Story'].dropna().tolist()[:20]
        print('Fetched stories:', stories)  # For debugging
        return jsonify(stories)
    except Exception as e:
        print(f"Error fetching stories: {e}")
        return jsonify({'error': 'Failed to fetch stories'}), 500


@app.route('/api/export', methods=['GET'])
def export_stories():
    try:
        return send_file('./Dataset_Hamza.csv', as_attachment=True)
    except Exception as e:
        print(f"Error exporting file: {e}")
        return jsonify({'error': 'Failed to export file'}), 500

if __name__ == '__main__':
    app.run(debug=True)
