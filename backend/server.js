const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
const rateLimit = require('express-rate-limit');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const port = 3001;

// Verify API key is properly set
if (!process.env.STABILITY_API_KEY) {
  console.error("Stability API key is missing!");
  process.exit(1);
}

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only jpeg and png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/generate', limiter);

// Route to handle image generation
app.post('/generate', async (req, res) => {
  try {
    const { prompt, style } = req.body;
    
    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ 
        error: 'Invalid prompt',
        details: 'Please provide at least 3 characters' 
      });
    }

    // Use the prompt directly or apply minimal enhancements based on style
    let enhancedPrompt = prompt;
    let stylePreset = "none"; // Default style
    let sampler = "K_EULER"; // Default sampler
    
    // Apply style presets if specified
    if (style === "anime") {
      stylePreset = "anime";
      sampler = "K_DPM_2_ANCESTRAL";
    } else if (style === "photographic") {
      stylePreset = "photographic";
    } else if (style === "digital-art") {
      stylePreset = "digital-art";
    } else if (style === "cinematic") {
      stylePreset = "cinematic-animation";
    }

    const requestBody = {
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1.0
        },
        {
          text: "blurry, text, watermark, low quality, deformed",
          weight: -1.0
        }
      ],
      cfg_scale: 7,
      steps: 30,
      width: 1024,
      height: 1024,
      samples: 1,
      style_preset: stylePreset,
      sampler: sampler
    };

    console.log("Sending request to Stability AI with:", requestBody);

    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000
      }
    );

    if (!response.data.artifacts?.[0]?.base64) {
      console.error("Unexpected response format:", response.data);
      throw new Error('API returned no image data');
    }

    return res.json({
      imageUrl: `data:image/png;base64,${response.data.artifacts[0].base64}`
    });
    
  } catch (error) {
    console.error("Full generation error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0] || 
                        error.message;

    return res.status(error.response?.status || 500).json({
      error: 'Generation failed',
      details: errorMessage || 'Unknown error occurred',
      suggestion: 'Please try a different prompt or try again later'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 