class PortfolioHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedImages();
    }

    bindEvents() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => this.handleFileSelect(e));
        });

        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.querySelector('input[type="file"]').click();
                }
            });
        });

        document.querySelectorAll('.upload-area').forEach(area => {
            area.addEventListener('dragover', this.handleDragOver);
            area.addEventListener('drop', this.handleDrop.bind(this));
            ['dragenter', 'dragleave', 'dragend'].forEach(type => {
                area.addEventListener(type, this.handleDragEnd);
            });
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && this.isValidImage(file)) {
            this.processFile(file, e.target);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragEnd(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (this.isValidImage(file)) {
                const input = e.currentTarget.querySelector('input[type="file"]');
                this.processFile(file, input);
            }
        }
    }

    isValidImage(file) {
        return file.type.startsWith('image/') && file.size < 10 * 1024 * 1024;
    }

    processFile(file, input) {
        const reader = new FileReader();
        const linkId = input.id.replace('Upload', 'Link');
        const previewId = input.id.replace('Upload', 'Preview');
        
        reader.onload = (e) => {
            const url = e.target.result;
            const preview = document.getElementById(previewId);
            const link = document.getElementById(linkId);
            
            preview.src = url;
            preview.hidden = false;
            link.href = url;
            link.textContent = 'View Full Image';
            
            this.saveImage(input.id, url, file.name);
        };
        
        reader.readAsDataURL(file);
    }

    saveImage(inputId, url, filename) {
        const saved = JSON.parse(localStorage.getItem('portfolioImages') || '{}');
        saved[inputId] = { url, filename, timestamp: Date.now() };
        localStorage.setItem('portfolioImages', JSON.stringify(saved));
    }

    loadSavedImages() {
        const saved = JSON.parse(localStorage.getItem('portfolioImages') || '{}');
        Object.entries(saved).forEach(([inputId, data]) => {
            if (data.url) {
                const previewId = inputId.replace('Upload', 'Preview');
                const linkId = inputId.replace('Upload', 'Link');
                
                const preview = document.getElementById(previewId);
                const link = document.getElementById(linkId);
                
                if (preview && link) {
                    preview.src = data.url;
                    preview.hidden = false;
                    link.href = data.url;
                    link.textContent = 'View Full Image';
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioHandler();
});
