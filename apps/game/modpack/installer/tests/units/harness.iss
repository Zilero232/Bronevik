; Unit harness for the installer's Pascal units (no wizard). test_units.py compiles it with ISCC, runs it
; with /CASES=<cases.ini> /OUT=<results.ini> /STATEROOT=<tmp>, and reads the results. InitializeSetup does
; the work and returns False, so the harness never shows a window or installs anything.
;   /DOtmBuildDir=<folder with components.iss and openwg\> (from tools/build/setupkit)

#define OtmAppVersion "units"
#define OPENWGUTILS_DIR_SRC OtmBuildDir + "\openwg\bin"
#define OPENWGUTILS_DIR_UNINST "openwg"

[Setup]
AppName=OtmUnits
AppVersion=1
DefaultDirName={tmp}\otm-units
CreateAppDir=no
Uninstallable=no
PrivilegesRequired=lowest
OutputBaseFilename=otm-units
Compression=none

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl,..\..\locales\en.isl"
Name: "ru"; MessagesFile: "compiler:Languages\Russian.isl,..\..\locales\ru.isl"

[Files]
Source: "..\..\assets\state\utf16.ini"; Flags: dontcopy

#include OtmBuildDir + "\openwg\openwg.utils.iss"
#include "..\..\src\common\strings.iss"
#include "..\..\src\common\fs.iss"
#include "..\..\src\components\catalog.iss"
#include OtmBuildDir + "\components.iss"
#include "..\..\src\detect\clients.iss"
#include "..\..\src\state\state.iss"
#include "..\..\src\state\installed.iss"
#include "..\..\src\backup\snapshot.iss"
#include "..\..\src\logs\collect.iss"

[Code]
var
  CasesFile, ResultsFile: String;

procedure PutResult(const Section, Key, Value: String);
begin
  SetIniString(Section, Key, Value, ResultsFile);
end;

function CaseCount(const Section: String): Integer;
begin
  Result := GetIniInt(Section, 'count', 0, 0, 1000, CasesFile);
end;

function CaseValue(const Section, Key: String): String;
begin
  Result := GetIniString(Section, Key, '', CasesFile);
end;

procedure RunVersions;
var
  I: Integer;
  Version: String;
begin
  for I := 0 to CaseCount('versions') - 1 do
  begin
    Version := CaseValue('versions', IntToStr(I));
    PutResult('versions', IntToStr(I), IntToStr(Ord(OtmIsSupportedVersion(Version))));
  end;
end;

procedure RunClients;
var
  I: Integer;
  Client: TOtmClient;
  Section: String;
begin
  for I := 0 to CaseCount('clients') - 1 do
  begin
    Section := 'client.' + IntToStr(I);
    if OtmAddClient(CaseValue('clients', IntToStr(I)), Client) then
    begin
      PutResult(Section, 'added', '1');
      PutResult(Section, 'path', Client.Path);
      PutResult(Section, 'version', Client.Version);
      PutResult(Section, 'branch', IntToStr(Client.Branch));
      PutResult(Section, 'mods', Client.ModsDir);
      PutResult(Section, 'res_mods', Client.ResModsDir);
      PutResult(Section, 'problem', Client.Problem);
    end
    else
      PutResult(Section, 'added', '0');
  end;
end;

procedure RunDependencies;
var
  I: Integer;
  Key: String;
begin
  for I := 0 to CaseCount('deps') - 1 do
  begin
    Key := IntToStr(I);
    if CaseValue('deps', Key + '.remove') = '' then
      PutResult('deps', Key, OtmWithDependencies(CaseValue('deps', Key + '.select')))
    else
      PutResult('deps', Key, OtmWithoutDependents(CaseValue('deps', Key + '.select'), CaseValue('deps', Key + '.remove')));
  end;
end;

{ A client described by the [state] section: path, version, mods, res_mods. }
function StateClient: TOtmClient;
begin
  Result.Index := -1;
  Result.Path := CaseValue('state', 'path');
  Result.Version := CaseValue('state', 'version');
  Result.Branch := OtmBranchRelease;
  Result.ModsDir := CaseValue('state', 'mods');
  Result.ResModsDir := CaseValue('state', 'res_mods');
  Result.Problem := '';
end;

procedure RunState;
var
  Client: TOtmClient;
  Action: String;
  Items: TArrayOfString;
begin
  Action := CaseValue('state', 'action');
  if Action = '' then
    Exit;
  Client := StateClient;
  if Action = 'snapshot' then
    PutResult('state', 'snapshot', OtmCreateSnapshot(Client))
  else if Action = 'restore' then
    PutResult('state', 'restored', IntToStr(Ord(OtmRestoreSnapshot(Client, OtmLatestSnapshot(Client)))))
  else if Action = 'prune' then
  begin
    OtmPruneSnapshots(Client);
    PutResult('state', 'left', StringJoin(',', OtmSnapshots(Client)));
  end
  else if Action = 'install' then
  begin
    OtmSaveClientState(Client);
    OtmRemoveOurFiles(Client);
    OtmWriteManifest(Client, CaseValue('state', 'components'));
    PutResult('state', 'manifest', OtmManifestPath(Client));
  end
  else if Action = 'cleanup' then
  begin
    OtmRemoveOurFiles(Client);
    PutResult('state', 'cleaned', '1');
  end
  else if Action = 'logs' then
    PutResult('state', 'zip', OtmCollectLogs(Client))
  else if Action = 'others' then
  begin
    Items := OtmOtherMods(Client);
    PutResult('state', 'others', StringJoin('|', Items));
  end;
end;

function InitializeSetup: Boolean;
begin
  CasesFile := ExpandConstant('{param:CASES|}');
  ResultsFile := ExpandConstant('{param:OUT|}');
  OtmCatalogInit;
  try
    RunVersions;
    RunClients;
    RunDependencies;
    RunState;
    PutResult('done', 'ok', '1');
  except
    PutResult('done', 'error', GetExceptionMessage);
  end;
  Result := False;
end;
