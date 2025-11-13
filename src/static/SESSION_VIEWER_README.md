# AI Coding Session Viewer

An elegant, simple UI to visualize AI coding sessions stored in JSON files.

## Features

- 📁 **Drag & Drop Upload**: Simply drag and drop JSON session files
- 🎨 **Beautiful UI**: Gradient backgrounds with smooth animations
- 💬 **Message Distinction**: Color-coded avatars for user vs assistant messages
- 💭 **Thinking Process**: Visualize AI's reasoning with highlighted sections
- 🔧 **Tool Data**: Display tool usage with input/output information
- 💻 **Code Highlighting**: Syntax highlighting for code blocks
- 📱 **Responsive**: Works on mobile and desktop devices
- 🔗 **Easy Navigation**: Integrated with main activities page

## JSON Format

The session viewer expects JSON files in the following format:

```json
[
  {
    "role": "user",
    "content": {
      "text": "Your message here"
    }
  },
  {
    "role": "assistant",
    "content": {
      "thinking": "Optional thinking process",
      "toolFormerData": {
        "tool": "tool_name",
        "input": "tool input",
        "output": "tool output"
      },
      "text": "Assistant's response"
    }
  }
]
```

### Field Descriptions

- **role** (required): Either `"user"` or `"assistant"`
- **content** (required): Object containing the message content
  - **text** (optional): Main text content of the message
  - **thinking** (optional, assistant only): AI's reasoning process
  - **toolFormerData** (optional, assistant only): Tool usage information
    - **tool**: Name of the tool used
    - **input**: Input provided to the tool
    - **output**: Output received from the tool

## Usage

### Accessing the Viewer

1. From the main activities page, click the "🤖 AI Session Viewer" link in the header
2. Or navigate directly to `/static/session-viewer.html`

### Loading a Session

**Option 1: Sample Sessions**
- Click one of the pre-loaded sample buttons:
  - 📝 Factorial Function
  - ⚛️ React Debugging
  - 🗄️ SQL Query

**Option 2: Upload Your Own**
- Click "Browse Files" or drag & drop a JSON file onto the upload area
- The file will be validated and displayed automatically

**Option 3: Direct File Input**
- Click anywhere in the dashed upload area to open file browser
- Select a `.json` file from your computer

### Viewing Sessions

Once loaded, you'll see:
- **User messages**: Purple avatar with blue-tinted background
- **Assistant messages**: Pink/red avatar with pink-tinted background
- **Thinking sections**: Light blue boxes with 💭 icon
- **Tool data**: Light pink boxes with 🔧 icon
- **Code blocks**: Dark theme syntax highlighting

### Clearing Sessions

Click the red "Clear Session" button to remove the current session and load a new one.

## Sample Sessions

Three sample sessions are included to demonstrate the format:

1. **example-session-1.json**: Simple conversation about creating a factorial function
2. **example-session-2.json**: React debugging with tool usage
3. **example-session-3.json**: SQL query with validation tool

## Technical Details

### Files

- `session-viewer.html`: Main HTML structure
- `session-viewer.css`: Styling and animations
- `session-viewer.js`: Loading and rendering logic
- `sample-sessions/`: Example JSON files

### Browser Compatibility

- Modern browsers with ES6+ support
- Drag and drop API support
- FileReader API support

### Security

- XSS protection through HTML escaping
- No external dependencies
- Client-side only processing (no data sent to server)

## Customization

### Adding New Samples

1. Create a new JSON file in `sample-sessions/`
2. Add a button in the HTML:
   ```html
   <button class="sample-button" data-file="sample-sessions/your-file.json">
     🎯 Your Title
   </button>
   ```

### Styling

Colors and themes can be customized in `session-viewer.css`:
- Gradient backgrounds: Line 10
- User message colors: Lines 234-238
- Assistant message colors: Lines 240-244
- Thinking section: Lines 280-293
- Tool section: Lines 296-310

## Error Handling

The viewer validates:
- JSON format correctness
- Array structure
- Required fields (role, content)
- File type (.json only)

Error messages are displayed via alerts for simplicity.

## Future Enhancements

Potential additions:
- Export sessions to PDF
- Search/filter within sessions
- Session comparison view
- Real-time session streaming
- Dark/light mode toggle
