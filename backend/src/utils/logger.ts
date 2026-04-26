import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'mindcare.log');
const AI_LOG_FILE = path.join(LOG_DIR, 'ai-chat.log');
const ASSESSMENT_LOG_FILE = path.join(LOG_DIR, 'assessment.log');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Format timestamp
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

// Write to file
const writeToFile = (file: string, message: string) => {
    const timestamp = getTimestamp();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    try {
        fs.appendFileSync(file, logMessage);
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
};

// Logger class
export class Logger {
    private context: string;

    constructor(context: string = 'APP') {
        this.context = context;
    }

    private formatMessage(level: string, message: string): string {
        return `[${level}] [${this.context}] ${message}`;
    }

    info(message: string) {
        const formatted = this.formatMessage('INFO', message);
        console.log(`\x1b[36m${formatted}\x1b[0m`); // Cyan
        writeToFile(LOG_FILE, formatted);
    }

    success(message: string) {
        const formatted = this.formatMessage('SUCCESS', message);
        console.log(`\x1b[32m✅ ${formatted}\x1b[0m`); // Green
        writeToFile(LOG_FILE, formatted);
    }

    error(message: string, error?: any) {
        const formatted = this.formatMessage('ERROR', message);
        console.error(`\x1b[31m❌ ${formatted}\x1b[0m`); // Red
        writeToFile(LOG_FILE, formatted);
        
        if (error) {
            const errorDetails = error.stack || error.message || JSON.stringify(error);
            console.error(`\x1b[31m${errorDetails}\x1b[0m`);
            writeToFile(LOG_FILE, errorDetails);
        }
    }

    warning(message: string) {
        const formatted = this.formatMessage('WARNING', message);
        console.warn(`\x1b[33m⚠️  ${formatted}\x1b[0m`); // Yellow
        writeToFile(LOG_FILE, formatted);
    }

    debug(message: string, data?: any) {
        const formatted = this.formatMessage('DEBUG', message);
        console.log(`\x1b[35m🔍 ${formatted}\x1b[0m`); // Magenta
        writeToFile(LOG_FILE, formatted);
        
        if (data) {
            const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
            console.log(`\x1b[35m${dataStr}\x1b[0m`);
            writeToFile(LOG_FILE, dataStr);
        }
    }

    // AI Chat specific logging
    aiChat(message: string, data?: any) {
        const formatted = this.formatMessage('AI-CHAT', message);
        console.log(`\x1b[34m🤖 ${formatted}\x1b[0m`); // Blue
        writeToFile(AI_LOG_FILE, formatted);
        
        if (data) {
            const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
            console.log(`\x1b[34m${dataStr}\x1b[0m`);
            writeToFile(AI_LOG_FILE, dataStr);
        }
    }

    // Assessment specific logging
    assessment(message: string, data?: any) {
        const formatted = this.formatMessage('ASSESSMENT', message);
        console.log(`\x1b[36m📊 ${formatted}\x1b[0m`); // Cyan
        writeToFile(ASSESSMENT_LOG_FILE, formatted);
        
        if (data) {
            const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
            console.log(`\x1b[36m${dataStr}\x1b[0m`);
            writeToFile(ASSESSMENT_LOG_FILE, dataStr);
        }
    }

    // Separator for readability
    separator() {
        const line = '='.repeat(80);
        console.log(`\x1b[90m${line}\x1b[0m`);
        writeToFile(LOG_FILE, line);
    }
}

// Export default logger
export const logger = new Logger('MINDCARE');

// Export specialized loggers
export const aiLogger = new Logger('AI-CHAT');
export const assessmentLogger = new Logger('ASSESSMENT');
export const authLogger = new Logger('AUTH');
export const dbLogger = new Logger('DATABASE');
