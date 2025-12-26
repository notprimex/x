class PrimeXGenerator {
    constructor() {
        this.currentGenerator = 'email';
        this.currentTheme = 'light';
        this.currentLanguage = 'en';
        this.generatedData = [];
        this.isGenerating = false;
        this.generationStartTime = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.updateDateTime();
        this.setupGenerators();
        this.setupAnimations();
        this.setupKeyboardShortcuts();
        this.setupPerformanceMonitor();
    }

    setupEventListeners() {
        this.setupGeneratorSwitching();
        this.setupThemeToggle();
        this.setupLanguageToggle();
        this.setupGenerateButton();
        this.setupExportButtons();
        this.setupClearButton();
        this.setupFormControls();
        this.setupDropdowns();
        this.setupSidebarToggle();
        this.setupSliderControls();
        this.setupRealTimeUpdates();
        this.setupDragAndDrop();
        this.setupTooltips();
        this.setupNotifications();
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('primex-theme') || 'light';
        this.setTheme(savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
            themeToggle.addEventListener('change', () => {
                this.setTheme(themeToggle.checked ? 'dark' : 'light');
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('primex-theme', theme);
        
        const themeIcon = document.querySelector('.theme-slider .fa-moon');
        if (themeIcon) {
            themeIcon.style.opacity = theme === 'dark' ? '1' : '0.5';
        }
    }

    setupGeneratorSwitching() {
        const generatorItems = document.querySelectorAll('.generator-item');
        generatorItems.forEach(item => {
            item.addEventListener('click', () => {
                const generator = item.dataset.generator;
                this.switchGenerator(generator);
                
                generatorItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                this.animateSwitch(item);
            });
        });
    }

    switchGenerator(generator) {
        this.currentGenerator = generator;
        
        const sections = document.querySelectorAll('.generator-section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        const activeSection = document.getElementById(`${generator}Section`);
        if (activeSection) {
            activeSection.classList.add('active');
            activeSection.style.display = 'block';
            this.animateSectionIn(activeSection);
        }
        
        this.updateGeneratorInfo(generator);
        this.updateUIForGenerator(generator);
        
        localStorage.setItem('primex-last-generator', generator);
    }

    updateGeneratorInfo(generator) {
        const titles = {
            'email': 'Email:Password Generator',
            'user': 'User:Password Generator',
            'cc': 'Credit Card Generator',
            'custom1': 'Custom Combo Generator 1',
            'custom2': 'Custom Combo Generator 2'
        };
        
        const descriptions = {
            'email': 'Generate unlimited email:password combinations with advanced customization options. Select domains, password types, and output format.',
            'user': 'Create username:password combinations with various username patterns and password strength options.',
            'cc': 'Generate valid credit card numbers for testing purposes with customizable BIN, expiration dates, and card types.',
            'custom1': 'Create custom combinations with your own format and rules.',
            'custom2': 'Advanced custom generator with template-based combinations.'
        };
        
        const titleElement = document.getElementById('generatorTitle');
        const descElement = document.getElementById('generatorDesc');
        
        if (titleElement) {
            const titleText = titleElement.querySelector('.title-text');
            if (titleText) titleText.textContent = titles[generator];
        }
        
        if (descElement) {
            descElement.textContent = descriptions[generator];
        }
    }

    setupGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateData());
            
            generateBtn.addEventListener('mouseenter', () => {
                this.animateButton(generateBtn, 'enter');
            });
            
            generateBtn.addEventListener('mouseleave', () => {
                this.animateButton(generateBtn, 'leave');
            });
        }
    }

    async generateData() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.generationStartTime = performance.now();
        
        this.showLoadingOverlay();
        this.disableButtons(true);
        
        const lines = this.getLineCount();
        const generator = this.currentGenerator;
        
        try {
            await this.simulateProcessing();
            
            switch (generator) {
                case 'email':
                    this.generatedData = this.generateEmailCombos(lines);
                    break;
                case 'user':
                    this.generatedData = this.generateUserCombos(lines);
                    break;
                case 'cc':
                    this.generatedData = this.generateCreditCards(lines);
                    break;
                case 'custom1':
                    this.generatedData = this.generateCustomCombos(lines, 1);
                    break;
                case 'custom2':
                    this.generatedData = this.generateCustomCombos(lines, 2);
                    break;
            }
            
            this.displayGeneratedData();
            this.updateGenerationStats();
            this.enableExportButtons();
            this.showSuccessNotification('Generation complete!');
            
        } catch (error) {
            this.showErrorNotification('Generation failed: ' + error.message);
        } finally {
            this.isGenerating = false;
            this.hideLoadingOverlay();
            this.disableButtons(false);
        }
    }

    generateEmailCombos(lines) {
        const combos = [];
        const domain = this.getEmailDomain();
        const passwordType = document.getElementById('passwordOption').value;
        
        for (let i = 0; i < lines; i++) {
            const username = this.generateUsername();
            const password = this.generatePassword(passwordType);
            combos.push(`${username}@${domain}:${password}`);
        }
        
        return combos;
    }

    generateUserCombos(lines) {
        const combos = [];
        const passwordType = document.getElementById('passwordOption').value;
        const pattern = document.querySelector('input[name="usernamePattern"]:checked').value;
        
        for (let i = 0; i < lines; i++) {
            const username = this.generateUsername(pattern, i);
            const password = this.generatePassword(passwordType);
            combos.push(`${username}:${password}`);
        }
        
        return combos;
    }

    generateCreditCards(lines) {
        const combos = [];
        const bin = this.getBIN() || this.generateRandomBIN();
        const cardType = this.getCardType();
        
        for (let i = 0; i < lines; i++) {
            const cardNumber = this.generateCardNumber(bin, cardType);
            const expiry = this.generateExpiryDate();
            const cvv = this.generateCVV(cardType);
            combos.push(`${cardNumber}|${expiry}|${cvv}`);
        }
        
        return combos;
    }

    generateCustomCombos(lines, generatorId) {
        const combos = [];
        
        for (let i = 0; i < lines; i++) {
            if (generatorId === 1) {
                combos.push(`custom${i + 1}:data${this.randomString(8)}`);
            } else {
                combos.push(`combo${i + 1}:value${this.randomString(10)}`);
            }
        }
        
        return combos;
    }

    generateUsername(pattern = 'random', index = 0) {
        const patterns = {
            'random': () => this.randomString(8),
            'sequential': (i) => `user${String(i + 1).padStart(6, '0')}`,
            'dictionary': () => this.getDictionaryWord() + this.randomNumber(100, 999)
        };
        
        return patterns[pattern](index);
    }

    generatePassword(type) {
        const generators = {
            'random': () => this.generateStrongPassword(),
            'fixed': () => document.getElementById('fixedPassword').value || 'password123',
            'numbers': () => this.randomNumber(10000000, 99999999).toString(),
            'pattern': () => this.generatePatternPassword(),
            'dictionary': () => this.getDictionaryWord() + this.randomNumber(10, 99)
        };
        
        return generators[type]();
    }

    generateStrongPassword(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }

    generateCardNumber(bin, type) {
        let number = bin;
        const length = type === 'amex' ? 15 : 16;
        
        while (number.length < length - 1) {
            number += Math.floor(Math.random() * 10);
        }
        
        number += this.calculateLuhnCheckDigit(number);
        return number.replace(/(.{4})/g, '$1 ').trim();
    }

    calculateLuhnCheckDigit(number) {
        let sum = 0;
        let alternate = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return (10 - (sum % 10)) % 10;
    }

    generateExpiryDate() {
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
        return `${month}/${year.toString().slice(-2)}`;
    }

    generateCVV(type) {
        return type === 'amex' ? 
            String(Math.floor(Math.random() * 9000) + 1000) :
            String(Math.floor(Math.random() * 900) + 100);
    }

    getEmailDomain() {
        const domainSelect = document.getElementById('emailDomain');
        const customDomain = document.getElementById('customDomain');
        
        if (domainSelect.value === 'custom' && customDomain.value) {
            return customDomain.value.replace('@', '');
        }
        
        return domainSelect.value;
    }

    getLineCount() {
        const input = document.getElementById('lineCountInput');
        const slider = document.getElementById('emailLines');
        
        let lines = parseInt(input?.value || slider?.value || 100);
        lines = Math.min(lines, 1000000);
        lines = Math.max(lines, 1);
        
        return lines;
    }

    getBIN() {
        return document.getElementById('binInput')?.value || '';
    }

    getCardType() {
        return document.getElementById('cardType')?.value || 'visa';
    }

    generateRandomBIN() {
        const bins = ['4532', '4916', '4485', '4716', '4024', '4175', '4571'];
        return bins[Math.floor(Math.random() * bins.length)];
    }

    randomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getDictionaryWord() {
        const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta'];
        return words[Math.floor(Math.random() * words.length)];
    }

    displayGeneratedData() {
        const outputArea = document.getElementById('outputArea');
        const resultsCount = document.getElementById('resultsCount');
        
        if (outputArea && this.generatedData.length > 0) {
            outputArea.value = this.generatedData.join('\n');
            
            if (resultsCount) {
                resultsCount.textContent = this.generatedData.length.toLocaleString();
            }
            
            this.updateLastGeneratedTime();
            this.autoScrollOutput();
            this.highlightOutput();
        }
    }

    updateGenerationStats() {
        const statsElement = document.getElementById('generationStats');
        const statsCount = document.getElementById('statsCount');
        const statsTime = document.getElementById('statsTime');
        
        if (statsElement && statsCount && statsTime) {
            const elapsed = performance.now() - this.generationStartTime;
            
            statsCount.textContent = this.generatedData.length.toLocaleString();
            statsTime.textContent = Math.round(elapsed);
            
            statsElement.style.display = 'flex';
            
            setTimeout(() => {
                statsElement.style.display = 'none';
            }, 5000);
        }
    }

    setupExportButtons() {
        const exportBtn = document.getElementById('exportBtn');
        const exportOptions = document.querySelectorAll('.export-option');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.generatedData.length > 0) {
                    this.copyToClipboard();
                }
            });
        }
        
        exportOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                
                switch (format) {
                    case 'copy':
                        this.copyToClipboard();
                        break;
                    case 'txt':
                        this.downloadAsFile('txt', 'text/plain');
                        break;
                    case 'csv':
                        this.downloadAsFile('csv', 'text/csv');
                        break;
                    case 'json':
                        this.downloadAsFile('json', 'application/json');
                        break;
                }
                
                this.hideDropdowns();
            });
        });
    }

    copyToClipboard() {
        if (this.generatedData.length === 0) return;
        
        const text = this.generatedData.join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccessNotification('Copied to clipboard!');
            
            const copyBtn = document.getElementById('copyBtn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        }).catch(err => {
            this.showErrorNotification('Failed to copy: ' + err.message);
        });
    }

    downloadAsFile(extension, mimeType) {
        if (this.generatedData.length === 0) return;
        
        let content = this.generatedData.join('\n');
        let filename = `primex_generated_${this.currentGenerator}_${Date.now()}.${extension}`;
        
        if (extension === 'json') {
            content = JSON.stringify({
                generator: this.currentGenerator,
                timestamp: new Date().toISOString(),
                count: this.generatedData.length,
                data: this.generatedData
            }, null, 2);
        } else if (extension === 'csv') {
            const headers = ['Index', 'Data'];
            const rows = this.generatedData.map((item, index) => [index + 1, item]);
            content = [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessNotification(`Downloaded as ${filename}`);
    }

    setupClearButton() {
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Clear all generated data?')) {
                    this.clearAllData();
                    this.showSuccessNotification('All data cleared');
                }
            });
        }
    }

    clearAllData() {
        this.generatedData = [];
        
        const outputArea = document.getElementById('outputArea');
        if (outputArea) outputArea.value = '';
        
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) resultsCount.textContent = '0';
        
        this.disableExportButtons();
        
        const lastGenerated = document.getElementById('lastGenerated');
        if (lastGenerated) lastGenerated.textContent = 'Never generated';
    }

    setupFormControls() {
        this.setupDomainToggle();
        this.setupPasswordToggle();
        this.setupRangeInputSync();
        this.setupRealTimeValidation();
    }

    setupDomainToggle() {
        const domainSelect = document.getElementById('emailDomain');
        const customGroup = document.getElementById('customDomainGroup');
        
        if (domainSelect && customGroup) {
            domainSelect.addEventListener('change', () => {
                if (domainSelect.value === 'custom') {
                    customGroup.style.display = 'block';
                    this.animateElement(customGroup, 'fadeIn');
                } else {
                    customGroup.style.display = 'none';
                }
            });
        }
    }

    setupPasswordToggle() {
        const passwordSelect = document.getElementById('passwordOption');
        const fixedGroup = document.getElementById('fixedPasswordGroup');
        
        if (passwordSelect && fixedGroup) {
            passwordSelect.addEventListener('change', () => {
                if (passwordSelect.value === 'fixed') {
                    fixedGroup.style.display = 'block';
                    this.animateElement(fixedGroup, 'fadeIn');
                } else {
                    fixedGroup.style.display = 'none';
                }
            });
            
            const generateFixedBtn = document.getElementById('generateFixedPass');
            if (generateFixedBtn) {
                generateFixedBtn.addEventListener('click', () => {
                    const fixedInput = document.getElementById('fixedPassword');
                    if (fixedInput) {
                        fixedInput.value = this.generateStrongPassword(12);
                    }
                });
            }
        }
    }

    setupRangeInputSync() {
        const slider = document.getElementById('emailLines');
        const input = document.getElementById('lineCountInput');
        const badge = document.getElementById('lineCountBadge');
        
        if (slider && input) {
            const updateValues = () => {
                const value = parseInt(slider.value);
                input.value = value;
                if (badge) badge.textContent = value.toLocaleString();
                
                this.updateSliderVisual(slider, value);
            };
            
            slider.addEventListener('input', updateValues);
            
            input.addEventListener('input', () => {
                let value = parseInt(input.value) || 100;
                value = Math.min(value, 1000000);
                value = Math.max(value, 1);
                
                slider.value = value;
                input.value = value;
                if (badge) badge.textContent = value.toLocaleString();
                
                this.updateSliderVisual(slider, value);
            });
            
            updateValues();
        }
        
        const sliderBtns = document.querySelectorAll('.slider-btn');
        sliderBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const change = parseInt(btn.dataset.change) || 0;
                const input = document.getElementById('lineCountInput');
                const slider = document.getElementById('emailLines');
                
                if (input && slider) {
                    let value = parseInt(input.value) + change;
                    value = Math.min(value, 1000000);
                    value = Math.max(value, 1);
                    
                    input.value = value;
                    slider.value = value;
                    
                    const badge = document.getElementById('lineCountBadge');
                    if (badge) badge.textContent = value.toLocaleString();
                    
                    this.updateSliderVisual(slider, value);
                    this.animateElement(btn, 'click');
                }
            });
        });
    }

    updateSliderVisual(slider, value) {
        const percent = (value / slider.max) * 100;
        slider.style.background = `linear-gradient(to right, 
            var(--ios-blue) 0%, 
            var(--ios-green) ${percent / 2}%, 
            var(--ios-purple) ${percent}%, 
            var(--ios-border-medium) ${percent}%, 
            var(--ios-border-medium) 100%)`;
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle, .icon-btn, .ios-btn');
            
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        const isVisible = menu.style.opacity === '1';
                        this.hideAllDropdowns();
                        if (!isVisible) {
                            this.showDropdown(menu);
                        }
                    }
                });
            }
        });
        
        document.addEventListener('click', () => {
            this.hideAllDropdowns();
        });
    }

    showDropdown(menu) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
    }

    hideAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        });
    }

    setupSidebarToggle() {
        const toggleBtn = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.style.width = '60px';
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
                } else {
                    sidebar.style.width = '280px';
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                }
                
                this.animateElement(sidebar, 'width');
            });
        }
    }

    setupSliderControls() {
        const sliders = document.querySelectorAll('.ios-slider');
        
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateSliderVisual(slider, slider.value);
            });
        });
    }

    setupRealTimeUpdates() {
        const updateInterval = setInterval(() => {
            this.updateDateTime();
            this.updatePerformanceStats();
        }, 60000);
        
        window.addEventListener('beforeunload', () => {
            clearInterval(updateInterval);
        });
    }

    updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const timeElement = document.querySelector('.status-time');
        if (timeElement) timeElement.textContent = timeString;
    }

    updateLastGeneratedTime() {
        const element = document.getElementById('lastGenerated');
        if (element) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            element.textContent = `Last: ${timeString}`;
        }
    }

    setupLanguageToggle() {
        const langBtn = document.getElementById('langBtn');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (langBtn) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = document.querySelector('.lang-menu');
                if (menu) {
                    const isVisible = menu.style.opacity === '1';
                    this.hideAllDropdowns();
                    if (!isVisible) {
                        this.showDropdown(menu);
                    }
                }
            });
        }
        
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.setLanguage(lang);
                
                langOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const btnLabel = document.querySelector('#langBtn .btn-label');
                if (btnLabel) btnLabel.textContent = lang.toUpperCase();
            });
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('primex-language', lang);
        
        const translations = {
            en: {
                generate: 'Generate Now',
                copy: 'Copy to Clipboard',
                download: 'Download as .txt',
                clear: 'Clear All'
            },
            ar: {
                generate: 'توليد الآن',
                copy: 'نسخ إلى الحافظة',
                download: 'تحميل كـ .txt',
                clear: 'مسح الكل'
            }
        };
        
        const strings = translations[lang] || translations.en;
        
        const generateBtn = document.getElementById('generateBtn');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        if (generateBtn) generateBtn.innerHTML = `<i class="fas fa-bolt"></i> ${strings.generate}`;
        if (copyBtn) copyBtn.innerHTML = `<i class="far fa-copy"></i> ${strings.copy}`;
        if (downloadBtn) downloadBtn.innerHTML = `<i class="fas fa-download"></i> ${strings.download}`;
        if (clearBtn) clearBtn.innerHTML = `<i class="fas fa-eraser"></i> ${strings.clear}`;
    }

    setupGenerators() {
        const lastGenerator = localStorage.getItem('primex-last-generator') || 'email';
        this.switchGenerator(lastGenerator);
        
        const lastGeneratorItem = document.querySelector(`.generator-item[data-generator="${lastGenerator}"]`);
        if (lastGeneratorItem) {
            lastGeneratorItem.classList.add('active');
        }
    }

    setupAnimations() {
        this.setupHoverAnimations();
        this.setupClickAnimations();
        this.setupScrollAnimations();
        this.setupLoadAnimations();
    }

    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('.config-card, .generator-item, .ios-btn');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.transition = 'transform 0.2s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }

    setupClickAnimations() {
        const clickElements = document.querySelectorAll('.ios-btn, .header-btn, .results-btn');
        
        clickElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.animateElement(e.currentTarget, 'click');
            });
        });
    }

    setupScrollAnimations() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.ios-navbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (navbar) navbar.style.transform = 'translateY(-100%)';
            } else {
                if (navbar) navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    setupLoadAnimations() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            setTimeout(() => {
                const elements = document.querySelectorAll('.config-card, .generator-item');
                elements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('loaded');
                    }, index * 50);
                });
            }, 300);
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        this.generateData();
                        break;
                    case 'c':
                        if (this.generatedData.length > 0) {
                            e.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.downloadAsFile('txt', 'text/plain');
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.hideAllDropdowns();
            }
        });
    }

    setupPerformanceMonitor() {
        if (typeof PerformanceObserver !== 'undefined') {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) {
                        console.warn('Slow operation detected:', entry.name, entry.duration);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['measure', 'mark'] });
        }
    }

    setupDragAndDrop() {
        const outputArea = document.getElementById('outputArea');
        
        if (outputArea) {
            outputArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                outputArea.classList.add('drag-over');
            });
            
            outputArea.addEventListener('dragleave', () => {
                outputArea.classList.remove('drag-over');
            });
            
            outputArea.addEventListener('drop', (e) => {
                e.preventDefault();
                outputArea.classList.remove('drag-over');
                
                const file = e.dataTransfer.files[0];
                if (file && file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        outputArea.value = event.target.result;
                        this.generatedData = outputArea.value.split('\n').filter(line => line.trim());
                        this.updateResultsCount();
                        this.enableExportButtons();
                    };
                    reader.readAsText(file);
                }
            });
        }
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'ios-tooltip';
                tooltip.textContent = element.title;
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
                
                element.tooltipElement = tooltip;
            });
            
            element.addEventListener('mouseleave', () => {
                if (element.tooltipElement) {
                    element.tooltipElement.remove();
                    element.tooltipElement = null;
                }
            });
        });
    }

    setupNotifications() {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const container = document.querySelector('.notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `ios-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }
        
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('.ios-input, .value-input');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('error');
                    input.classList.add('success');
                } else {
                    input.classList.remove('success');
                    input.classList.add('error');
                }
            });
        });
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('outputOverlay');
        if (overlay) {
            overlay.classList.add('active');
            
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '0%';
                setTimeout(() => {
                    progressFill.style.width = '100%';
                }, 10);
            }
            
            const progressIndicator = document.getElementById('progressIndicator');
            if (progressIndicator) {
                progressIndicator.style.display = 'flex';
            }
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('outputOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            
            const progressIndicator = document.getElementById('progressIndicator');
            if (progressIndicator) {
                progressIndicator.style.display = 'none';
            }
        }
    }

    disableButtons(disable) {
        const buttons = document.querySelectorAll('#generateBtn, #exportBtn, #copyBtn, #downloadBtn');
        
        buttons.forEach(button => {
            button.disabled = disable;
            if (disable) {
                button.classList.add('loading');
            } else {
                button.classList.remove('loading');
            }
        });
    }

    enableExportButtons() {
        const exportBtn = document.getElementById('exportBtn');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (exportBtn) exportBtn.disabled = false;
        if (copyBtn) copyBtn.disabled = false;
        if (downloadBtn) downloadBtn.disabled = false;
    }

    disableExportButtons() {
        const exportBtn = document.getElementById('exportBtn');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (exportBtn) exportBtn.disabled = true;
        if (copyBtn) copyBtn.disabled = true;
        if (downloadBtn) downloadBtn.disabled = true;
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.generatedData.length.toLocaleString();
        }
    }

    autoScrollOutput() {
        const outputArea = document.getElementById('outputArea');
        if (outputArea) {
            outputArea.scrollTop = outputArea.scrollHeight;
        }
    }

    highlightOutput() {
        const outputArea = document.getElementById('outputArea');
        if (outputArea) {
            outputArea.classList.add('highlight');
            setTimeout(() => {
                outputArea.classList.remove('highlight');
            }, 1000);
        }
    }

    updateUIForGenerator(generator) {
        const badges = document.querySelectorAll('.title-badge');
        badges.forEach(badge => {
            badge.style.background = `linear-gradient(135deg, var(--generator-${generator}), var(--ios-blue-light))`;
        });
        
        const indicator = document.querySelector('.nav-indicator');
        if (indicator) {
            indicator.style.background = `linear-gradient(90deg, var(--generator-${generator}) 0%, var(--ios-green) 50%, var(--ios-purple) 100%)`;
        }
    }

    async simulateProcessing() {
        return new Promise(resolve => {
            const lines = this.getLineCount();
            const delay = Math.min(lines * 0.1, 1000);
            
            setTimeout(resolve, delay);
        });
    }

    animateElement(element, animation) {
        element.classList.add(`animate-${animation}`);
        
        setTimeout(() => {
            element.classList.remove(`animate-${animation}`);
        }, 300);
    }

    animateSwitch(element) {
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    animateSectionIn(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 10);
    }

    animateButton(button, action) {
        if (action === 'enter') {
            button.style.transform = 'scale(1.05)';
        } else {
            button.style.transform = 'scale(1)';
        }
    }

    generatePatternPassword() {
        const patterns = [
            'Aa1!Bb2@',
            'Cc3#Dd4$',
            'Ee5%Ff6^',
            'Gg7&Hh8*'
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    updatePerformanceStats() {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
            
            console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
    }

    hideDropdowns() {
        this.hideAllDropdowns();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const primex = new PrimeXGenerator();
    
    window.primex = primex;
    
    console.log('PrimeX Generators v2.1.4 - Engine initialized');
    console.log('Created by PrimeX (@notprimex)');
    
    primex.showSuccessNotification('PrimeX Generators ready!');
});

window.addEventListener('beforeunload', (e) => {
    if (window.primex?.generatedData?.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved generated data. Are you sure you want to leave?';
        return e.returnValue;
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

if ('indexedDB' in window) {
    const request = indexedDB.open('PrimeXGeneratorsDB', 1);
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('generatedData')) {
            const store = db.createObjectStore('generatedData', { keyPath: 'id', autoIncrement: true });
            store.createIndex('generator', 'generator', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('presets')) {
            db.createObjectStore('presets', { keyPath: 'id' });
        }
    };
    
    request.onsuccess = (event) => {
        console.log('IndexedDB initialized successfully');
    };
    
    request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
    };
}

if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.config-card, .generator-item').forEach(element => {
        observer.observe(element);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('resize', debounce(() => {
    if (window.primex) {
        window.primex.updateSliderVisuals();
    }
}, 250));

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.primex) {
        window.primex.updateDateTime();
    }
});

if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
    console.log('Clipboard API available');
} else {
    console.warn('Clipboard API not available, fallback will be used');
}

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
          }
