[Code]
{ «Collect logs»: one zip on the desktop for a bug report. It holds the setup log, the game's python.log,
  version.xml / paths.xml, a listing of the mod folders, our config.json and our state (manifest.ini,
  client.ini, snapshot.ini files). Never credentials.json: it holds the device secret. }

procedure OtmListFolder(const Dir, OutFile: String);
var
  ResultCode: Integer;
begin
  if DirExists(Dir) then
    Exec(ExpandConstant('{cmd}'), '/C dir /S /A ' + AddQuotes(Dir) + ' >> ' + AddQuotes(OutFile), '', SW_HIDE,
      ewWaitUntilTerminated, ResultCode)
  else
    SaveStringToFile(OutFile, 'missing: ' + Dir + #13#10, True);
end;

procedure OtmCopyState(const StateDir, Target: String);
var
  Snapshots: TArrayOfString;
  I: Integer;
begin
  ForceDirectories(Target);
  OtmCopyIfExists(StateDir + '\client.ini', Target);
  OtmCopyIfExists(StateDir + '\manifest.ini', Target);
  Snapshots := OtmListEntries(StateDir + '\backups');
  for I := 0 to GetArrayLength(Snapshots) - 1 do
    if FileExists(StateDir + '\backups\' + Snapshots[I] + '\snapshot.ini') then
      CopyFile(StateDir + '\backups\' + Snapshots[I] + '\snapshot.ini', Target + '\snapshot-' + Snapshots[I] + '.ini', False);
end;

{ The desktop, or /LOGSDIR=<folder> (tests). }
function OtmLogsTarget: String;
begin
  Result := ExpandConstant('{param:LOGSDIR|}');
  if Result = '' then
    Result := ExpandConstant('{userdesktop}');
end;

{ Returns the zip path, or '' on failure. }
function OtmCollectLogs(const Client: TOtmClient): String;
var
  Dir, Listing, Zip: String;
begin
  Dir := ExpandConstant('{tmp}\otmetki-logs');
  DelTree(Dir, True, True, True);
  ForceDirectories(Dir + '\game');
  OtmCopyIfExists(ExpandConstant('{log}'), Dir);
  OtmCopyIfExists(AddBackslash(Client.Path) + 'python.log', Dir + '\game');
  OtmCopyIfExists(AddBackslash(Client.Path) + 'version.xml', Dir + '\game');
  OtmCopyIfExists(AddBackslash(Client.Path) + 'paths.xml', Dir + '\game');
  OtmCopyIfExists(OtmConfigsDir(Client.Path) + '\config.json', Dir + '\game');
  Listing := Dir + '\game\folders.txt';
  OtmListFolder(Client.ModsDir, Listing);
  OtmListFolder(Client.ResModsDir, Listing);
  OtmListFolder(OtmConfigsDir(Client.Path), Listing);
  OtmCopyState(OtmClientStateDir(Client), Dir + '\state');
  SaveStringToFile(Dir + '\about.txt', 'installer {#OtmAppVersion}, modpack {#OtmModpackVersion}' + #13#10 +
    'client ' + Client.Path + ' ' + Client.Version + #13#10 + 'collected ' + GetDateTimeString('yyyy-mm-dd hh:nn:ss', '-', ':') + #13#10, False);
  Zip := AddBackslash(OtmLogsTarget) + 'TriOtmetki-logs-' + GetDateTimeString('yyyymmdd-hhnnss', #0, #0) + '.zip';
  if OtmZipFolder(Dir, Zip) then
    Result := Zip
  else
    Result := '';
end;

procedure OtmRevealFile(const FileName: String);
var
  ErrorCode: Integer;
begin
  ShellExecAsOriginalUser('open', 'explorer.exe', '/select,' + AddQuotes(FileName), '', SW_SHOWNORMAL, ewNoWait, ErrorCode);
end;
