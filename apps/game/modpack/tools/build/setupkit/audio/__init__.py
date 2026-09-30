"""The catalog's audio previews: the sound a component ships, copied next to components.json for the manager.

    assets/<preview.audio>  -> previews/<component id>.<ext>
"""
import os
import shutil

from ..manifest.catalog import AUDIO_DIR


def copy_audio(manifest, catalog, modpack_dir, out_dir):
    """Every component's audio preview at its manifest path under out_dir; returns the written paths."""
    written = []
    for component in manifest.components:
        entry = catalog.entry(component.id)
        has_audio = component.preview.audio and entry is not None and entry.preview.audio
        if not has_audio:
            continue
        source = os.path.join(modpack_dir, AUDIO_DIR, *entry.preview.audio.split('/'))
        target = os.path.join(out_dir, *component.preview.audio.split('/'))
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copyfile(source, target)
        written.append(target)
    return written
