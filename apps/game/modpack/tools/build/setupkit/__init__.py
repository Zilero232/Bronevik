"""setupkit: builds the Windows installer (apps/game/modpack/installer) around the release packages.

    manifest/  catalog.json + tools/build/layout.py -> components.json (the manifest the installer and,
               later, the manager read)
    inno/      components.json -> the generated Inno Setup includes; finds and runs ISCC
    artwork/   SVG sources -> wizard images, the setup icon and component previews
    openwg/    fetches the pinned OpenWG.Utils release (client detection DLL + its Inno include)

Run it as `python tools/build/setupkit --help` (see __main__.py).
"""
import os

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODPACK_DIR = os.path.dirname(os.path.dirname(BUILD_DIR))
INSTALLER_DIR = os.path.join(MODPACK_DIR, 'installer')
CATALOG_PATH = os.path.join(INSTALLER_DIR, 'catalog', 'catalog.json')
ASSETS_DIR = os.path.join(INSTALLER_DIR, 'assets')
