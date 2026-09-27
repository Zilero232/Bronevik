[Code]
{ Snapshots of a client's mod folders before we change them, and one-click rollback.
  A snapshot is backups\<yyyymmdd-hhnnss>\ with snapshot.ini and a mirror of each part that existed:
    mods      mods\<version>          (every package, ours and others')
    res_mods  res_mods\<version>
    configs   mods\configs\otmetki    (our config and binding)
  Restoring mirrors each part back, and deletes a part that did not exist when the snapshot was taken.
  The newest OtmKeepSnapshots stay. }

const
  OtmKeepSnapshots = 3;

function OtmSnapshotsDir(const Client: TOtmClient): String;
begin
  Result := OtmClientStateDir(Client) + '\backups';
end;

function OtmSnapshotPart(const Client: TOtmClient; Part: Integer; var Name: String): String;
begin
  case Part of
    0: begin Name := 'mods'; Result := Client.ModsDir; end;
    1: begin Name := 'res_mods'; Result := Client.ResModsDir; end;
  else
    begin Name := 'configs'; Result := OtmConfigsDir(Client.Path); end;
  end;
end;

{ Snapshot folder names, oldest first (the names sort by time). }
function OtmSnapshots(const Client: TOtmClient): TArrayOfString;
var
  Entries: TArrayOfString;
  List: TStringList;
  I: Integer;
begin
  SetArrayLength(Result, 0);
  Entries := OtmListEntries(OtmSnapshotsDir(Client));
  List := TStringList.Create;
  try
    for I := 0 to GetArrayLength(Entries) - 1 do
      if FileExists(OtmSnapshotsDir(Client) + '\' + Entries[I] + '\snapshot.ini') then
        List.Add(Entries[I]);
    List.Sort;
    for I := 0 to List.Count - 1 do
      OtmAppend(Result, List[I]);
  finally
    List.Free;
  end;
end;

function OtmLatestSnapshot(const Client: TOtmClient): String;
var
  Snapshots: TArrayOfString;
begin
  Snapshots := OtmSnapshots(Client);
  if GetArrayLength(Snapshots) = 0 then
    Result := ''
  else
    Result := Snapshots[GetArrayLength(Snapshots) - 1];
end;

{ '20260927-214705' -> '27.09.2026 21:47'. }
function OtmSnapshotDate(const Snapshot: String): String;
begin
  Result := Copy(Snapshot, 7, 2) + '.' + Copy(Snapshot, 5, 2) + '.' + Copy(Snapshot, 1, 4) + ' ' +
    Copy(Snapshot, 10, 2) + ':' + Copy(Snapshot, 12, 2);
end;

{ The folders a restore replaces, one per line, for the confirmation dialog. }
function OtmSnapshotTargets(const Client: TOtmClient): String;
var
  Part: Integer;
  Name: String;
begin
  Result := '';
  for Part := 0 to 2 do
    Result := Result + OtmSnapshotPart(Client, Part, Name) + #13#10;
end;

procedure OtmPruneSnapshots(const Client: TOtmClient);
var
  Snapshots: TArrayOfString;
  I: Integer;
begin
  Snapshots := OtmSnapshots(Client);
  for I := 0 to GetArrayLength(Snapshots) - OtmKeepSnapshots - 1 do
    OtmDeleteEntry(OtmSnapshotsDir(Client) + '\' + Snapshots[I]);
end;

{ Returns the new snapshot's name, or '' when a copy failed (the partial snapshot is removed). }
function OtmCreateSnapshot(const Client: TOtmClient): String;
var
  Dir, Ini, Name, Source: String;
  Part: Integer;
  Ok: Boolean;
begin
  Result := GetDateTimeString('yyyymmdd-hhnnss', #0, #0);
  Dir := OtmSnapshotsDir(Client) + '\' + Result;
  Ini := Dir + '\snapshot.ini';
  Ok := ForceDirectories(Dir);
  OtmNewIni(Ini);
  SetIniString('snapshot', 'client', Client.Path, Ini);
  SetIniString('snapshot', 'date', GetDateTimeString('yyyy-mm-dd hh:nn:ss', '-', ':'), Ini);
  for Part := 0 to 2 do
  begin
    Source := OtmSnapshotPart(Client, Part, Name);
    SetIniString('snapshot', Name, Source, Ini);
    SetIniBool('snapshot', Name + '_exists', DirExists(Source), Ini);
    if Ok and DirExists(Source) then
      Ok := OtmMirror(Source, Dir + '\' + Name);
  end;
  if not Ok then
  begin
    OtmDeleteEntry(Dir);
    Result := '';
  end;
end;

function OtmRestoreSnapshot(const Client: TOtmClient; const Snapshot: String): Boolean;
var
  Dir, Ini, Name, Target: String;
  Part: Integer;
begin
  Dir := OtmSnapshotsDir(Client) + '\' + Snapshot;
  Ini := Dir + '\snapshot.ini';
  Result := FileExists(Ini);
  for Part := 0 to 2 do
  begin
    if not Result then
      Exit;
    OtmSnapshotPart(Client, Part, Name);
    Target := GetIniString('snapshot', Name, '', Ini);
    if Target = '' then
      Continue;
    if GetIniBool('snapshot', Name + '_exists', False, Ini) then
      Result := ForceDirectories(Target) and OtmMirror(Dir + '\' + Name, Target)
    else if DirExists(Target) then
      Result := OtmDeleteEntry(Target);
  end;
end;
