const { Colors } = require("./colors.js");
const { Slugs } = require("./slugs.js");


class ConsoleLogLevels {

    static BaseProps = {
        _slug:Slugs.Console,
        reset:Colors.Console.Reset,
        dim: Colors.Console.Dim,
    }

    static System = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Sytem,
        primary:    Colors.Console.FgMagenta,
        secondary:  '',
        emoji:      ''
    }
    static Info = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Info,
        primary:    Colors.Console.FgCyan,
        secondary:  '',
        emoji:      ''
    }
    static Debug = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Debug,
        primary:    Colors.Console.FgGray,
        secondary:  '',
        emoji:      ''
    }
    static Success = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Success,
        primary:    Colors.Console.BgGreen,
        secondary:  '',
        emoji:      ''
    }
    static Error = {
        ...ConsoleLogLevels.BaseProps,
        primary:    Colors.Console.FgYellow,
        toString: () => Slugs.Error,
        secondary:  '',
        emoji:      ''
    }
    static Failed = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Failed,
        primary:    Colors.Console.FgRed,
        secondary:  '',
        emoji:      ''
    }
    static Warning = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Warning,
        primary:    `${Colors.Console.BgYellow}${Colors.Console.FgBlack}`,
        secondary:  '',
        emoji:      ''
    }
    static Critical = {
        ...ConsoleLogLevels.BaseProps,
        toString: () => Slugs.Critical,
        primary:    `${Colors.Console.BgRed}${Colors.Console.FgBlack}`,
        secondary:  '',
        emoji:      ''
    }
}

class LogLevels {
    static Default = ConsoleLogLevels.Info;
    
}


module.exports = {
    ConsoleLogLevels,
    LogLevels,
}
