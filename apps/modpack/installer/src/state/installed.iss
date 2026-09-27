[Code]
{ manifest.ini: the files we put into a client, so updates and uninstall touch only ours.
    section install: client, version, mods, installer, modpack, date, components
    section files:   count, 0..count-1 = absolute paths
  Our packages are also recognised by name (OtmOwnedPatterns from catalog.json), which covers files from
  installs that predate the manifest or were copied by hand. }

function OtmManifestPath(const Client: TOtmClient): String;
begin
  Result := OtmClientStateDir(Client) + '\manifest.ini';
end;

function OtmIsInstalled(const Client: TOtmClient): Boolean;
begin
  Result := FileExists(OtmManifestPath(Client));
end;

function OtmIsOwnedFile(const FileName: String): Boolean;
begin
  Result := OtmMatchesAny(ExtractFileName(FileName), '{#OtmOwnedPatterns}');
end;

procedure OtmWriteManifest(const Client: TOtmClient; const Components: String);
var
  Ini: String;
  Files: TArrayOfString;
  I: Integer;
begin
  Ini := OtmManifestPath(Client);
  OtmNewIni(Ini);
  SetIniString('install', 'client', Client.Path, Ini);
  SetIniString('install', 'version', Client.Version, Ini);
  SetIniString('install', 'mods', Client.ModsDir, Ini);
  SetIniString('install', 'installer', '{#OtmAppVersion}', Ini);
  SetIniString('install', 'modpack', '{#OtmModpackVersion}', Ini);
  SetIniString('install', 'date', GetDateTimeString('yyyy-mm-dd hh:nn:ss', '-', ':'), Ini);
  SetIniString('install', 'components', Components, Ini);
  Files := OtmCatalogFiles(OtmWithDependencies(Components));
  SetIniInt('files', 'count', GetArrayLength(Files), Ini);
  for I := 0 to GetArrayLength(Files) - 1 do
    SetIniString('files', IntToStr(I), AddBackslash(Client.ModsDir) + Files[I], Ini);
end;

function OtmManifestFiles(const ManifestIni: String): TArrayOfString;
var
  I, Count: Integer;
begin
  SetArrayLength(Result, 0);
  Count := GetIniInt('files', 'count', 0, 0, 10000, ManifestIni);
  for I := 0 to Count - 1 do
    OtmAppend(Result, GetIniString('files', IntToStr(I), '', ManifestIni));
end;

{ Removes the files of the previous install (manifest) and anything named like our packages in the mods
  folder. Never touches other files. }
procedure OtmRemoveOurFiles(const Client: TOtmClient);
var
  Files, Entries: TArrayOfString;
  I: Integer;
begin
  Files := OtmManifestFiles(OtmManifestPath(Client));
  for I := 0 to GetArrayLength(Files) - 1 do
    if (Files[I] <> '') and OtmIsOwnedFile(Files[I]) and FileExists(Files[I]) then
      OtmDeleteEntry(Files[I]);
  Entries := OtmListEntries(Client.ModsDir);
  for I := 0 to GetArrayLength(Entries) - 1 do
    if OtmIsOwnedFile(Entries[I]) and FileExists(AddBackslash(Client.ModsDir) + Entries[I]) then
      OtmDeleteEntry(AddBackslash(Client.ModsDir) + Entries[I]);
end;

{ Everything in mods\<version> and res_mods\<version> that is not ours: what «remove other mods» deletes. }
function OtmOtherMods(const Client: TOtmClient): TArrayOfString;
var
  Entries: TArrayOfString;
  I: Integer;
begin
  SetArrayLength(Result, 0);
  Entries := OtmListEntries(Client.ModsDir);
  for I := 0 to GetArrayLength(Entries) - 1 do
    if not OtmIsOwnedFile(Entries[I]) then
      OtmAppend(Result, AddBackslash(Client.ModsDir) + Entries[I]);
  Entries := OtmListEntries(Client.ResModsDir);
  for I := 0 to GetArrayLength(Entries) - 1 do
    OtmAppend(Result, AddBackslash(Client.ResModsDir) + Entries[I]);
end;
