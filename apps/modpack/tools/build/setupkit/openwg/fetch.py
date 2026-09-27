"""Fetches the pinned OpenWG.Utils release: the client-detection DLL and its Inno Setup include.

OpenWG.Utils (MIT, https://gitlab.com/openwg/openwg.utils) finds the game clients registered in Lesta Game
Center (and WGC, Steam, standalone), reads version.xml / paths.xml and knows whether a client is running.
The release zip and the licence are pinned by sha256; the download is cached under dist/.
"""
import hashlib
import os
import shutil
import tempfile
import urllib.request
import zipfile

RELEASE = 'v2026.06.21.1'
ZIP_URL = ('https://gitlab.com/api/v4/projects/14440720/uploads/a528bca33b4fb642a1023ebbb47248fb/'
           'OpenWG.Utils_v2026.06.21.1.zip')
ZIP_SHA256 = 'c89500d4673aa7171a33e080d49aa69f07788748afc2adae66a44dedcccaa598'
LICENSE_URL = 'https://gitlab.com/api/v4/projects/14440720/repository/files/LICENSE.md/raw?ref=' + RELEASE
LICENSE_SHA256 = '95b7eb9b750d21e2116bfcc2bb82d55cb5a085918aa8029182873d9e045e59d7'
# zip member -> path under the output folder; setup.iss points OPENWGUTILS_DIR_SRC at bin/.
MEMBERS = {
    'bin/openwg.utils.x86_32.dll': 'bin/openwg.utils.x86_32.dll',
    'innosetup/openwg.utils.iss': 'openwg.utils.iss',
}


class FetchError(RuntimeError):
    pass


def sha256_of(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        for chunk in iter(lambda: handle.read(1 << 16), b''):
            digest.update(chunk)
    return digest.hexdigest()


def download(url, target, sha256, opener=urllib.request.urlopen):
    """Downloads url to target unless a file with the right hash is already there."""
    if os.path.isfile(target) and sha256_of(target) == sha256:
        return target
    os.makedirs(os.path.dirname(target), exist_ok=True)
    handle, partial = tempfile.mkstemp(dir=os.path.dirname(target), suffix='.part')
    try:
        with os.fdopen(handle, 'wb') as output, opener(url) as response:
            shutil.copyfileobj(response, output)
        actual = sha256_of(partial)
        if actual != sha256:
            raise FetchError('%s: sha256 %s, expected %s' % (url, actual, sha256))
        os.replace(partial, target)
    finally:
        if os.path.exists(partial):
            os.remove(partial)
    return target


def extract(archive_path, out_dir):
    with zipfile.ZipFile(archive_path) as archive:
        names = set(archive.namelist())
        for member, relative in MEMBERS.items():
            if member not in names:
                raise FetchError('%s has no %s' % (archive_path, member))
            target = os.path.join(out_dir, *relative.split('/'))
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with archive.open(member) as source, open(target, 'wb') as output:
                shutil.copyfileobj(source, output)


def fetch(out_dir, cache_dir, opener=urllib.request.urlopen):
    """Puts bin/openwg.utils.x86_32.dll, openwg.utils.iss and LICENSE.md into out_dir."""
    archive_path = download(ZIP_URL, os.path.join(cache_dir, 'OpenWG.Utils_%s.zip' % RELEASE), ZIP_SHA256, opener)
    license_path = download(LICENSE_URL, os.path.join(cache_dir, 'OpenWG.Utils_%s.LICENSE.md' % RELEASE), LICENSE_SHA256, opener)
    extract(archive_path, out_dir)
    shutil.copyfile(license_path, os.path.join(out_dir, 'LICENSE.md'))
    return out_dir
