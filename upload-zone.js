class UploadZone {
    constructor(options = {}) {
        this.options = {
            containerSelector: options.containerSelector || '.upload-zone',
            inputSelector: options.inputSelector || '#fileToUpload',
            uploadUrl: options.uploadUrl || window.location.href,
            onUploadStart: options.onUploadStart || (() => { }),
            onUploadProgress: options.onUploadProgress || (() => { }),
            onUploadSuccess: options.onUploadSuccess || (() => { }),
            onUploadError: options.onUploadError || (() => { }),
            onUploadComplete: options.onUploadComplete || (() => { }),
            allowMultiple: options.allowMultiple || true,
            acceptedFiles: options.acceptedFiles || '*',
            maxFileSize: options.maxFileSize || null, // in bytes
            customStyles: options.customStyles || {}
        };

        this.init();
    }

    init() {
        this.setupStyles();

        // Create DOM elements
        this.createElements();

        // Initialize event listeners
        this.initializeEventListeners();
    }

    createElements() {
        // Create file input if it doesn't exist
        this.fileInput = document.querySelector(this.options.inputSelector);
        if (!this.fileInput) {
            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.id = this.options.inputSelector.replace('#', '');
            this.fileInput.className = 'hidden';
            if (this.options.allowMultiple) {
                this.fileInput.multiple = true;
            }
            if (this.options.acceptedFiles !== '*') {
                this.fileInput.accept = this.options.acceptedFiles;
            }
        }

        // Create instructions element
        this.instructions = document.createElement('div');
        this.instructions.textContent = 'Drag & drop files here or click to browse';

        // Create progress indicator
        this.progressIndicator = document.createElement('div');
        this.progressIndicator.className = 'upload-progress hidden';
        this.progressIndicator.innerHTML = `
            <div class="spinner"></div>
            <span class="progress-text">Uploading...</span>
        `;

        // Append elements to upload zone container
        this.container = document.querySelector(this.options.containerSelector);

        this.container.appendChild(this.fileInput);
        this.container.appendChild(this.instructions);
        this.container.appendChild(this.progressIndicator);
    }

    setupStyles() {
        // Create style element
        const style = document.createElement('style');
        style.textContent = `
            .upload-zone {
                border: 2px dashed #e5e7eb;
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
                transition: all 0.2s ease;
                cursor: pointer;
                background-color: #ffffff;
                ${Object.entries(this.options.customStyles)
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n')}
            }

            .upload-zone:hover {
                border-color: #3b82f6;
                background-color: #f8fafc;
            }

            .upload-zone.drag-over {
                border-color: #3b82f6;
                background-color: #f8fafc;
            }

            .upload-progress {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 1rem;
            }

            .upload-progress.hidden {
                display: none;
            }

            .spinner {
                animation: spin 1s linear infinite;
                border: 2px solid #e2e8f0;
                border-top: 2px solid #3b82f6;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                margin-right: 0.75rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    initializeEventListeners() {
        // Prevent defaults for drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.container.addEventListener(eventName, this.preventDefaults, false);
        });

        // Handle drag states
        ['dragenter', 'dragover'].forEach(eventName => {
            this.container.addEventListener(eventName, () => {
                this.container.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.container.addEventListener(eventName, () => {
                this.container.classList.remove('drag-over');
            });
        });

        // Handle drops
        this.container.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                if (this.options.allowMultiple) {
                    this.handleFiles(files);
                } else {
                    this.handleFiles([files[0]]);
                }
            }
        });

        // Handle file input change
        this.fileInput.addEventListener('change', (e) => {
            if (this.fileInput.files.length > 0) {
                if (this.options.allowMultiple) {
                    this.handleFiles(this.fileInput.files);
                } else {
                    this.handleFiles([this.fileInput.files[0]]);
                }
            }
        });

        this.container.addEventListener('click', () => {
            this.fileInput.click();
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            // Check file size if maxFileSize is set
            if (this.options.maxFileSize && file.size > this.options.maxFileSize) {
                this.options.onUploadError({
                    file,
                    error: `File size exceeds maximum of ${this.formatBytes(this.options.maxFileSize)}`
                });
                return;
            }

            this.uploadFile(file);
        });
    }

    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        this.options.onUploadStart(file);
        this.progressIndicator.classList.remove('hidden');

        fetch(this.options.uploadUrl, {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then(data => {
            if (data.success) {
                this.options.onUploadSuccess(data);
            } else {
                this.options.onUploadError(data);
            }
        }).catch(error => {
            this.options.onUploadError({
                success: false,
                error: error
            });
        }).finally(() => {
            this.progressIndicator.classList.add('hidden');
            this.fileInput.value = '';
            this.options.onUploadComplete();
        });
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
