class SettingsShareError(Exception):

    def __init__(self, reason):
        Exception.__init__(self, reason)
        self.reason = reason
