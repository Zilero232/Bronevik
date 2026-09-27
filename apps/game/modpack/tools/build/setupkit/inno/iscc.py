"""Finding and running the Inno Setup 6 command-line compiler (ISCC.exe).

Looked up as --iscc, $ISCC, ISCC on PATH, then the default per-machine and per-user install folders.
CI installs it with `choco install innosetup` (see .github/workflows/modpack.yml).
"""
import os
import shutil
import subprocess

INSTALL_DIRS = (
    ('ProgramFiles(x86)', 'Inno Setup 6'),
    ('ProgramFiles', 'Inno Setup 6'),
    ('LOCALAPPDATA', os.path.join('Programs', 'Inno Setup 6')),
)


def find_iscc(explicit=None):
    candidates = [explicit, os.environ.get('ISCC'), shutil.which('ISCC'), shutil.which('iscc')]
    for env, folder in INSTALL_DIRS:
        if os.environ.get(env):
            candidates.append(os.path.join(os.environ[env], folder, 'ISCC.exe'))
    return next((candidate for candidate in candidates if candidate and os.path.isfile(candidate)), None)


def command(iscc, script, defines, output_dir=None, output_base=None):
    args = [iscc, '/Qp']
    args += ['/D%s=%s' % (name, value) for name, value in sorted(defines.items())]
    if output_dir:
        args.append('/O%s' % output_dir)
    if output_base:
        args.append('/F%s' % output_base)
    return args + [script]


def compile_script(iscc, script, defines, output_dir=None, output_base=None):
    """Runs ISCC; raises CalledProcessError with the compiler output on failure."""
    result = subprocess.run(command(iscc, script, defines, output_dir, output_base), capture_output=True, text=True, errors='replace')
    if result.returncode != 0:
        raise subprocess.CalledProcessError(result.returncode, result.args, result.stdout, result.stderr)
    return result.stdout
