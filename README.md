# 🗑️ Waste Bin Sorter - Object Detection Website

An interactive web application that uses your webcam and a Google Teachable Machine model to identify objects and automatically sort them into the correct waste bins (Recycling, Compost, or Landfill).

## ✨ Features

- 📷 **Real-time Webcam Detection** - Live object identification through your webcam
- 🤖 **Teachable Machine Integration** - Uses your custom-trained TensorFlow.js model
- 🎯 **Automatic Bin Classification** - Intelligently categorizes detected objects
- 📊 **Confidence Scores** - Shows detection confidence for each object
- 📱 **Mobile Friendly** - Works on phones, tablets, and desktops
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- ♻️ **Three Bin Categories**:
  - **Recycling Bin** (♻️) - Plastic, paper, metal, glass
  - **Compost Bin** (🌱) - Food, organic matter
  - **Landfill Bin** (🗑️) - Non-recyclables, ceramics, styrofoam

## 🚀 Quick Start

### 1. Export Your Teachable Machine Model

1. Go to [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Open your trained image model
3. Click **"Export Model"**
4. Select **"TensorFlow.js"**
5. Click **"Download"** and extract the `.zip` file
6. You need these files:
   - `model.json`
   - `metadata.json`

### 2. Use the Website

1. Open `index.html` in your web browser
2. Upload your `model.json` and `metadata.json` files
3. Click **"Load Model"** and wait for the success message ✅
4. Click **"Start Camera"** to begin detection
5. Point your webcam at objects and watch the magic happen! 🪄

## 📁 Files Included

- **index.html** - Main webpage with upload and camera interface
- **app.js** - Detection logic and bin classification system
- **style.css** - Modern, responsive styling

## 🔧 How It Works

1. **Model Upload** - Load your custom Teachable Machine model
2. **Webcam Access** - Request permission to access your webcam
3. **Real-time Detection** - Continuously analyzes webcam feed
4. **Classification** - Automatically sorts objects into bins based on:
   - Keyword matching (e.g., "plastic" → Recycling)
   - Confidence scores (>60% accuracy required)
5. **Visual Feedback** - Shows predictions and bin recommendations

## 🎓 Training Your Model

### What to Train On:
- Common household waste items (bottles, cans, food, etc.)
- Different angles and lighting conditions
- 50+ examples per class for best results

### Classes to Create:
1. **Recyclable Items** - Bottles, cans, paper, cardboard
2. **Compostable Items** - Food waste, organic matter
3. **Landfill Items** - Ceramics, plastic wrap, styrofoam

## ⚙️ Customization

Edit `app.js` to modify bin classifications:

```javascript
const binClassifications = {
    recycling: ['plastic', 'bottle', 'can', 'aluminum', ...],
    compost: ['food', 'apple', 'banana', ...],
    landfill: ['ceramic', 'pottery', ...]
};
```

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam access
- Google Teachable Machine model (TensorFlow.js format)

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Notes

- The model runs **locally in your browser** - no data is sent to servers
- First load may take a few seconds
- Camera permission is required
- Works best with good lighting conditions

## 🆘 Troubleshooting

**Model won't load?**
- Make sure both `model.json` and `metadata.json` are selected
- Check browser console for error messages

**Webcam not working?**
- Check browser permissions for camera access
- Try refreshing the page
- Ensure another app isn't using the camera

**Inaccurate predictions?**
- Train your Teachable Machine model with more examples
- Use varied angles and lighting conditions
- Increase confidence threshold in `app.js` (change 0.6 to higher value)

## 📚 Resources

- [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
- [TensorFlow.js Documentation](https://js.tensorflow.org/)
- [Teachable Machine Community](https://github.com/googlecreativelab/teachablemachine-community)

## 💡 Ideas for Enhancement

- Add save/export results feature
- Create statistics dashboard
- Add sound alerts for different bins
- Multiple model support
- Real-time FPS counter
- Adjust detection sensitivity slider

---

**Made with ❤️ for waste sorting education**
