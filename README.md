# Ghibli Art Generator

A web application that transforms your uploaded images into Studio Ghibli style artwork using AI-powered image-to-image transformation.

## Features

- Drag and drop image upload
- Real-time progress tracking
- Image-to-image transformation
- Studio Ghibli style artistic conversion
- Image download functionality
- Responsive design

## Tech Stack

- **Frontend**: React, Material UI, Tailwind CSS
- **Backend**: Node.js, Express
- **Image Processing**: Sharp
- **AI Integration**: Stability AI's SDXL image-to-image API
- **Security**: Rate limiting, input validation

## Installation

### Prerequisites

- Node.js 14+
- npm or yarn
- Stability AI API key (sign up at https://stability.ai/)

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/ghibli-art-generator.git
cd ghibli-art-generator
```

2. Install dependencies:
```
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:
```
STABILITY_API_KEY=your_stability_ai_api_key
```

4. Start the servers:
```
# Start backend server
cd backend
node server.js

# Start frontend development server
cd ../frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Upload an image using the drag-and-drop area or click to browse
2. Click the "Transform to Ghibli Style" button
3. Wait for the transformation to complete
4. Download your Ghibli-style image

## How It Works

The application takes your uploaded image and transforms it using Stability AI's image-to-image model. The process:

1. Your image is uploaded to the backend server
2. The image is preprocessed and resized to optimal dimensions
3. The AI model applies Studio Ghibli artistic styling while preserving the composition of your original image
4. The transformed image is sent back to your browser for viewing and download

## API Reference

### `POST /generate`

Transforms an uploaded image into Studio Ghibli style.

**Request Body**: 
- MultiPart Form Data with an image file (jpeg or png)

**Response**:
```json
{
  "imageUrl": "data:image/png;base64,..."
}
```

## License

MIT

## Acknowledgments

- Stability AI for their powerful image-to-image transformation API
- Studio Ghibli for their iconic artistic style 