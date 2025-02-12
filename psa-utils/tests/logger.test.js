const { WriteToConsoleLog } = require('../logger/index');
const { LogLevels } = require('../logger/log-levels'); // Assuming LogLevels is imported

describe('WriteToConsoleLog', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    });

    afterEach(() => {
        consoleSpy.mockRestore(); // Restore original console.log after each test
    });

    test('logs message with default level', () => {
        WriteToConsoleLog(LogLevels.Default, 'Test message');
    
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/); // Match ISO timestamp
        expect(consoleSpy.mock.calls[0][0]).toContain('Test message'); // Ensure message is logged
    });

    test('logs an error message', () => {
        const error = new Error('Something went wrong');

        WriteToConsoleLog(LogLevels.Default, error);

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toContain('Error: Something went wrong'); // Ensures error message is logged
    });

    test('logs with a custom LogLevel', () => {
        const customLevel = {
            toString: () => 'CUSTOM',
            reset: '',
            dim: '',
            primary: '\x1b[32m', // Green color
            secondary: '\x1b[36m', // Cyan color
            emoji: '🔥'
        };

        WriteToConsoleLog(customLevel, 'Custom log test');

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toContain('🔥'); // Check emoji is included
        expect(consoleSpy.mock.calls[0][0]).toContain('CUSTOM'); // Custom level should appear
        expect(consoleSpy.mock.calls[0][0]).toContain('Custom log test'); // Check log message
    });
});