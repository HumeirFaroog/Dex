# Images Directory

This directory is for storing images used in the application.

## Recommended Image Sources

For the landing page, you can use images from:

1. **Unsplash** (Free, high-quality):
   - Healthcare: https://unsplash.com/s/photos/healthcare
   - Medical: https://unsplash.com/s/photos/medical
   - Doctor: https://unsplash.com/s/photos/doctor
   - Hospital: https://unsplash.com/s/photos/hospital

2. **Pexels** (Free):
   - https://www.pexels.com/search/healthcare/

3. **Pixabay** (Free):
   - https://pixabay.com/images/search/healthcare/

## Image Suggestions

### Hero Section
- Healthcare professional with technology
- Modern medical facility
- Doctor using tablet/computer
- Medical dashboard interface

### Features Section
- AI/Technology in healthcare
- Appointment booking interface
- Chat/communication tools
- Medical reports/documents

## Usage

The landing page uses Unsplash images with fallback placeholders. To use local images:

1. Place images in this directory
2. Update image paths in `Landing.jsx`:
   ```jsx
   <img src="/images/hero-image.jpg" alt="Healthcare AI" />
   ```

## Image Optimization

For production, consider:
- Using WebP format for better compression
- Optimizing images with tools like ImageOptim or Squoosh
- Using responsive images with `srcset`
- Lazy loading images

