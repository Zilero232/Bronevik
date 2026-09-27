from ..compat import to_text


def font(text, color, size=None):
    """`text` in a GUIFlash `<font>` tag (the HTML subset the panels render)."""
    if size:
        return u'<font color="%s" size="%d">%s</font>' % (color, size, to_text(text))
    return u'<font color="%s">%s</font>' % (color, to_text(text))
