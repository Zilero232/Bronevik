; Three Marks modpack installer (Inno Setup 6.7). Build it with tools/build/setupkit, which generates the
; includes under OtmBuildDir and passes the defines below; see installer/README.md.

#ifndef OtmBuildDir
  #define OtmBuildDir "..\dist\installer\build"
#endif
#ifndef OtmPackagesDir
  #define OtmPackagesDir "..\dist"
#endif
#ifndef OtmAppVersion
  #define OtmAppVersion "0.0.0-dev"
#endif

#define OtmAppName "Три отметки"
#define OtmSite "https://triotmetki.ru"

; OpenWG.Utils (MIT): client detection. setupkit fetches the pinned release into OtmBuildDir\openwg.
#define OPENWGUTILS_DIR_SRC OtmBuildDir + "\openwg\bin"
#define OPENWGUTILS_DIR_UNINST "openwg"

[Setup]
AppId={{6C1B7E57-3D0A-4B5E-9F3A-7A0C2B8E4D19}
AppName={#OtmAppName}
AppVersion={#OtmAppVersion}
AppVerName={#OtmAppName} {#OtmAppVersion}
AppPublisher={#OtmAppName}
AppPublisherURL={#OtmSite}
AppSupportURL={#OtmSite}
AppUpdatesURL={#OtmSite}
AppCopyright=© {#OtmAppName}
; The packages go into the game client ({code:OtmModsDir}); {app} holds only the uninstaller and our state
; (install manifests, backups), so the install folder is fixed and per user.
DefaultDirName={localappdata}\TriOtmetki
DisableDirPage=yes
DisableProgramGroupPage=yes
DisableWelcomePage=no
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline
UsedUserAreasWarning=no
UsePreviousSetupType=yes
UsePreviousTasks=yes
CloseApplications=no
RestartApplications=no
Uninstallable=yes
UninstallDisplayName={#OtmAppName}
UninstallFilesDir={app}\uninstall
SetupLogging=yes
UninstallLogging=yes
ShowLanguageDialog=auto
LanguageDetectionMethod=uilanguage
OutputDir={#OtmBuildDir}\..
OutputBaseFilename=otmetki-setup-{#OtmAppVersion}
Compression=lzma2/max
SolidCompression=yes
; Branding: dark graphite with the orange accent of the site (apps/web/client/shared/styles/_tokens.scss).
WizardStyle=modern dark includetitlebar hidebevels
WizardSizePercent=150,130
WizardBackColor=#18181b
WizardImageBackColor=#0e0e10
WizardSmallImageBackColor=#18181b
WizardImageFile={#OtmBuildDir}\artwork\wizard-*.png
WizardSmallImageFile={#OtmBuildDir}\artwork\small-*.png
SetupIconFile={#OtmBuildDir}\artwork\setup.ico
UninstallDisplayIcon={app}\uninstall\unins000.exe

[Languages]
Name: "ru"; MessagesFile: "compiler:Languages\Russian.isl,locales\ru.isl"
Name: "en"; MessagesFile: "compiler:Default.isl,locales\en.isl"

[Tasks]
Name: "backup"; Description: "{cm:OtmTaskBackup}"
Name: "removeothers"; Description: "{cm:OtmTaskRemoveOthers}"; Flags: unchecked

[Files]
Source: "assets\state\utf16.ini"; Flags: dontcopy
Source: "{#OtmBuildDir}\openwg\LICENSE.md"; DestDir: "{app}\licenses"; DestName: "OpenWG.Utils.LICENSE.md"; Flags: ignoreversion

#include OtmBuildDir + "\openwg\openwg.utils.iss"
#include OtmBuildDir + "\files.iss"

; Pascal units, in dependency order.
#include "src\common\strings.iss"
#include "src\common\fs.iss"
#include "src\components\catalog.iss"
#include OtmBuildDir + "\components.iss"
#include "src\detect\clients.iss"
#include "src\state\state.iss"
#include "src\state\installed.iss"
#include "src\backup\snapshot.iss"
#include "src\logs\collect.iss"
#include "src\profiles\profiles.iss"
#include "src\pages\client_page.iss"
#include "src\pages\maintenance_page.iss"
#include "src\pages\components_page.iss"
#include "src\pages\other_mods_page.iss"
#include "src\events\setup_events.iss"
#include "src\events\uninstall_events.iss"
