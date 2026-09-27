[Code]
{ Per-client state under %LOCALAPPDATA%\TriOtmetki\clients\<key>\ (key: a hash of the client folder):
    client.ini     the client this state belongs to
    manifest.ini   what we installed there (installed.iss)
    backups\<yyyymmdd-hhnnss>\  snapshots (snapshot.iss)
  The same folder is DefaultDirName, so the uninstaller finds it too. }

{ /STATEROOT=<folder> moves it elsewhere, for tests. }
function OtmStateRoot: String;
begin
  Result := ExpandConstant('{param:STATEROOT|}');
  if Result = '' then
    Result := ExpandConstant('{localappdata}\TriOtmetki');
end;

function OtmClientsStateDir: String;
begin
  Result := OtmStateRoot + '\clients';
end;

function OtmClientKey(const ClientPath: String): String;
begin
  Result := Copy(GetSHA256OfUnicodeString(Lowercase(RemoveBackslashUnlessRoot(ClientPath))), 1, 16);
end;

function OtmClientStateDir(const Client: TOtmClient): String;
begin
  Result := OtmClientsStateDir + '\' + OtmClientKey(Client.Path);
end;

{ mods\configs\otmetki: the config and credentials of our mod (see the modpack README). }
function OtmConfigsDir(const ClientPath: String): String;
begin
  Result := AddBackslash(ClientPath) + 'mods\configs\otmetki';
end;

{ Starts an empty .ini from assets\state\utf16.ini (only a UTF-16 BOM): Windows then writes the file as
  UTF-16 and keeps Cyrillic paths intact whatever the ANSI code page. Setup only. }
procedure OtmNewIni(const FileName: String);
var
  Template: String;
begin
  ForceDirectories(ExtractFileDir(FileName));
  Template := ExpandConstant('{tmp}\utf16.ini');
  if not FileExists(Template) then
    ExtractTemporaryFile('utf16.ini');
  if not CopyFile(Template, FileName, False) then
    DeleteFile(FileName);
end;

procedure OtmSaveClientState(const Client: TOtmClient);
var
  Ini: String;
begin
  Ini := OtmClientStateDir(Client) + '\client.ini';
  OtmNewIni(Ini);
  SetIniString('client', 'path', Client.Path, Ini);
  SetIniString('client', 'version', Client.Version, Ini);
  SetIniString('client', 'mods', Client.ModsDir, Ini);
  SetIniString('client', 'res_mods', Client.ResModsDir, Ini);
end;

{ The client recorded in a state folder (the uninstaller has no OpenWG client list). }
function OtmLoadClientState(const StateDir: String; var Client: TOtmClient): Boolean;
var
  Ini: String;
begin
  Ini := StateDir + '\client.ini';
  Result := FileExists(Ini);
  if not Result then
    Exit;
  Client.Index := -1;
  Client.Path := GetIniString('client', 'path', '', Ini);
  Client.Version := GetIniString('client', 'version', '', Ini);
  Client.Branch := 0;
  Client.ModsDir := GetIniString('client', 'mods', '', Ini);
  Client.ResModsDir := GetIniString('client', 'res_mods', '', Ini);
  Client.Problem := '';
  Result := Client.Path <> '';
end;
