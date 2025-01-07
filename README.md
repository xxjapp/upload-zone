# Upload Zone

[![](https://data.jsdelivr.com/v1/package/gh/xxjapp/upload-zone/badge)](https://www.jsdelivr.com/package/gh/xxjapp/upload-zone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, customizable JavaScript library for handling file uploads with drag and drop support.

## Features

- 🎨 Fully customizable through options
- 📂 Drag and drop support
- 📤 Single or multiple file uploads
- 📊 Built-in progress indicator
- ✅ File size validation
- 🎯 Event callbacks for upload lifecycle
- 🪶 Zero dependencies
- 🔌 Easy integration with any project

## Installation

Include it directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/xxjapp/upload-zone@0.1.0/upload-zone.min.js"></script>
```

## Usage

1. Add the HTML container:

```html
<div class="upload-zone"></div>
```

2. Initialize the upload zone:

```javascript
const uploadZone = new UploadZone({
    containerSelector: '.upload-zone',
    uploadUrl: '/upload',
    allowMultiple: true,
    acceptedFiles: 'image/*',
    maxFileSize: 5 * 1024 * 1024  // 5MB
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerSelector` | string | `.upload-zone` | CSS selector for the upload container |
| `inputSelector` | string | `#fileToUpload` | CSS selector for file input |
| `uploadUrl` | string | `window.location.href` | URL to handle file uploads |
| `allowMultiple` | boolean | `true` | Allow multiple file uploads |
| `acceptedFiles` | string | `*/*` | MIME types to accept |
| `maxFileSize` | number | `null` | Maximum file size in bytes |
| `customStyles` | object | `{}` | Custom CSS styles for container |

## Events

The library provides callbacks for various upload events:

```javascript
const uploadZone = new UploadZone({
    // ... other options
    onUploadStart: (file) => {
        console.log('Upload starting:', file.name);
    },
    onUploadSuccess: (data) => {
        console.log('Upload successful:', data);
    },
    onUploadError: (error) => {
        console.error('Upload failed:', error);
    },
    onUploadComplete: () => {
        console.log('Upload completed');
    }
});
```

## Automatic Handling

The library handles the following automatically:
- Drag and drop events
- File input click events
- Upload progress indication
- Success/error states
- File validation
- Visual feedback during drag operations

## Styling

You can customize the appearance by either modifying the built-in styles or adding your own CSS classes:

```css
.upload-zone {
    min-height: 200px;
    width: 100%;
    border: 2px dashed #ccc;
    /* Add your custom styles */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
